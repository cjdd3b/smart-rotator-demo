SMART ROTATOR EXPERIMENT

Can you show a user five comments that summarize the gist of an entire online discussion?

That's what this experiment is about. Comments on news articles are often redundant, poorly organized and hard to navigate. As a result, many unabashed non-commenters (like me) rarely read them. The question is, can surfacing a small but representative subset of those comments through an interface like a rotator provide an accessible enough entry point that non-commenters might be encouraged to engage.

For this demo, we'll use a collection of several thousand comments -- in this case, a selection of responses to The New York Times' "High Time" opinion series, which argues for the legalization of marijuana -- and attempt to distill them automatically into representative themes.

But how to select the comments? In an ideal world, human moderators would do it. But let's assume that's impractical for most organizations, so we want to try an automated system instead. We'll call it a "Smart Rotator."

Let's start with the most naive way of getting a comment sample: random selection, which looks like this:

DUMB_ROTATOR_HERE

Meh. Sometimes it shows variety, sometimes it's repetitive. Either way, we have no guarantee that the comments represented here represent anything about the discussion as a whole. It's a rotator, but it's dumb. We want something smarter -- maybe something conceptually similar to the visualization below, which shows public comments to the Federal Communiations Commission about net neutrality, by the data analysis company Quid.

VIZ HERE

I have no idea how that graph was produced, but it does a couple things that any smart rotator should aspire to. For one, it condenses a bunch of comments (more than 1.1 million) into a small number of themes. And second, it seems to identify those latent themes by looking at the contents of the comments themselves.

What sorcery is this?! I'm not sure. But one way to achieve a similar effect is through the use of topic modeling. For our comment set, we can use a technique called Non-Negative Matrix Factorization to achieve a similar effect.

You can read about the guts here, but essentially we can use NMF to distill our comments into a pre-defined number of topics based on the words they contain. If you look at the words that compose the topics, you can see some pretty clear patterns emerge:

TABLE

EXPLANATION

SMART_ROTATOR_HERE

The differences aren't immediately obvious, but at least we can guarantee that the comments being displayed here represent a good cross-section of the subject matter represented in the comment set.

FUTURE WORK

If this demo proves anything, it's that simple modeling can be used to describe comments in vaguely useful ways. Personally, I'm not blown away by the results, but they suggest a few potential directions going forward.

MODEL USEFULNESS, NOVELTY, ETC.

COMBINE THAT WITH TOPIC MODELS

NMF is just one of a large number of topic modeling and clustering algorithms that could be applied to a problem like this. It works reasonably well here because it assigns comments to thematic buckets based on the words they contain. That makes it a little smarter than systems based on simple document similarity metrics, which is great for finding near-duplicate comments but is perhaps less useful for discovering latent structure.

Generative approches like LDA and LSA, or other discriminative algorithms like singular value decomposition, might also yield useful results but I didn't try them here. Those