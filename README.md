Smart Rotator
=============

An experiment in using matrix factorization to summarize online comment threads.

How to run
-----------

If you just want to view the rotator:

    git clone git@github.com:cjdd3b/smart-rotator-demo.git
    cd smart-rotator-demo/ui
    python -mSimpleHTTPServer

Then open your browser and visit: http://127.0.0.1:8000/

If you want to run the processor:

    git clone git@github.com:cjdd3b/smart-rotator-demo.git
    pip install -r requirements.txt
    cd smart-rotator-demo/processor
    python nmf.py 

What is it?
-----------

I haven't been a fan of online comments ever since my reporting days. Even when they're not ignorant or offensive, they're too often redundant and boring. They're written by commenters, for commenters. And with rare exception, I can almost never summon up the interest to care about what individual commenters have to say, either as a journalist or a reader. Harsh maybe, but I suspect I'm not alone.

That said, I've always had an abstract interest in what the commenting community as a whole has to say about a given story -- in summarizing entire threads into their core arguments, so that readers, or reporters, could understand the gist of the comments without having to read through them all. That's what this experiment is about. 

How does it work?
-----------------

The code uses [non-negative matrix factorization](http://en.wikipedia.org/wiki/Non-negative_matrix_factorization) to find cohesive topics in a thread of comments left on the Times' [High Time](http://www.nytimes.com/interactive/2014/07/27/opinion/sunday/high-time-marijuana-legalization.html) opinion series, which advocates for the legalization of marijuana.

Matrix factorization algorithms like NMF and [singular value deocomposition](http://en.wikipedia.org/wiki/Singular_value_decomposition) have proven to be relatively simple and intuitive methods for distilling large sets of documents into smaller sets of topics. The approach in this experiment converts about 8,000 comments into TF-IDF weighted vectors containing the top 10,000 1- 2- and 3-grams in the comment corpus. We then use NMF to factorize that 8,000 x 10,000 matrix into smaller matrices representing five key topics.

Those topics are represented by collections of words, which look like this:

<table>
<thead>
  <tr>
    <th>Topic Number</th>
    <th>Key Words</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>marijuana alcohol tobacco use alcohol tobacco harmful dangerous ...</td>
    <td>Comments equating marijuana with alcohol and tobacco use</td>
  </tr>
  <tr>
    <td>2</td>
    <td>time past past time long end long past high time legalize long past time ...</td>
    <td>Comments stating that the editorial is long overdue</td>
  </tr>
  <tr>
    <td>3</td>
    <td>agree editorial board editorial board agree editorial ban federal times ...</td>
    <td>Comments addressing the editorial board directly</td>
  </tr>
  <tr>
    <td>4</td>
    <td>state states legal just think legal marijuana colorado ...</td>
    <td>Comments that draw parallels between states like Colorado and federal policy</td>
  </tr>
  <tr>
    <td>5</td>
    <td>people drug drugs war tax prohibition law money cannabis ...</td>
    <td>Comments making a point about the war on drugs</td>
  </tr>
</tbody>
</table>

Individual comments are then assigned to particular topics, based on the words they contain, and presented to the user in the form of a rotator.

Conclusion
----------

At best, this experiment suggests that it's possible to extract common arguments from large comment threads.

This kind of an approach could be used to build interactives around particular comment threads, or to summarize comments for reporters who don't want to wade through entire threads to see what readers have to say about their piece.

The rotator also exposes readers to comments passively, rather than requiring them to actively seek out the comments section of a story. Seeding rotators with high-value, representative comments would no doubt lead to a better user experience than a random smattering.