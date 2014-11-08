import json, operator, math, itertools
import numpy as np
from scipy.sparse.linalg import svds
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import NMF

N_FEATURES = 10000 # Number of distinct words/phrases considered by the model
N_TOPICS = 5 # Total number of topics the model should identify
TOPIC_THRESHOLD = 0.3 # From 0 to 1, indicates how strongly a comment belongs with a topic

if __name__ == '__main__':
    with open('../ui/data/weed-original.json', 'rb') as infile:
        jsonfile = json.loads(infile.read())['all_submissions']

        # Vectorize the comments and calculate tfidf weights
        docs = [rec['overview_initial_comment'].lower().strip() if rec['overview_initial_comment'] else '' for rec in jsonfile]
        vectorizer = TfidfVectorizer(max_df=0.95, min_df=2, ngram_range=(1, 3),
            max_features=N_FEATURES, stop_words='english', use_idf=True)
        tfidf = vectorizer.fit_transform(docs)

        # Run basic NMF, which will be used later
        nmf = NMF(n_components=N_TOPICS, sparseness='data', max_iter=1000, random_state=1).fit(tfidf)

        # Normalize NMF
        transformed_nmf = nmf.transform(tfidf)
        normalized_nmf = transformed_nmf / np.sum(transformed_nmf, axis=1, keepdims=True)

        print 'Reconstruction error: %s' % str(nmf.reconstruction_err_)

        # NOTE: You could also use something like raw SVD here, but this NMF implementation
        # seems to give better results. This is the scipy version for sparse matrices.
        # u, s, vt = svds(tfidf, k=N_TOPICS, which='LM')

        for i, comment in enumerate(jsonfile):
            comment['topics'] = np.where(normalized_nmf[i] > TOPIC_THRESHOLD)[0].tolist()

        # Print out the key words
        feature_names = vectorizer.get_feature_names()
        for topic_idx, topic in enumerate(nmf.components_):
            print("Topic #%d:" % topic_idx)
            print(" ".join([feature_names[i]
                            for i in topic.argsort()[:-20 - 1:-1]]))
            print()

    # with open('../ui/data/weed-processed.json', 'w') as outfile:
    #     json.dump({'all_submissions': jsonfile}, outfile)