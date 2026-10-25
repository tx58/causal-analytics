// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
1.0,
"Welcome to this module."
],
[
3.0,
"In the live sessions, we have been running regressions and reading their output."
],
[
8.0,
"Here, we step back and ask why any of it works."
],
[
12.0,
"Every number we compute comes from a sample."
],
[
15.0,
"So how close is the sample number to the truth?"
],
[
18.0,
"Two results answer that question, the law of large numbers and the central limit theorem."
],
[
23.0,
"Once we have them, we use them to build confidence intervals and we open up regressions itself."
],
[
29.0,
"Where the OLS formulas come from and why a regression coefficient has a standard error."
],
[
35.0,
"You can watch this like a video with the slides advancing on their own or you can go at your own pace."
],
[
41.0,
"Many slides have something you can try and take your time with those."
]
],
"how-to": [
[
0.0,
"A quick tour of this page. Every slide has its own short voiceover. Press the space bar or the play"
],
[
6.8,
"button to hear it and change the speed at the bottom right. You can decide the pace and use the arrow,"
],
[
13.7,
"keys or the list of slides on the left. If you prefer to sit back, turn on the auto advance and"
],
[
19.4,
"the page plays like a video. It stops on the slides where you have something to do. The transcript"
],
[
25.2,
"is under each slide, so you can read instead of listening if you like. Slides marked try it"
],
[
31.2,
"have some small simulation exercises. The codes runs Python inside the page, so you don't need to"
],
[
37.8,
"install anything, but if you like, you can also try the codes on Google Colab. For the exam,"
],
[
44.3,
"focus on ideas but not really about memorizing the formularies. The derivations are those for you to"
],
[
54.0,
"see where the results come from. You don't need to learn to reproduce those results."
]
],
"roadmap": [
[
0.1,
"Here's a question behind every estimate."
],
[
3.4,
"Suppose you survey 400 customers"
],
[
6.2,
"and their average spending is like $45."
],
[
9.8,
"You want the average of all your consumers,"
],
[
11.8,
"not those 400."
],
[
13.8,
"So how close is that 45 likely to be?"
],
[
18.5,
"So parts one to four answers this"
],
[
20.6,
"for the simplest estimate, a sample mean."
],
[
23.2,
"Part five to seven show that a regression coefficient"
],
[
26.5,
"is just a more elaborate sample average."
],
[
29.4,
"And the same ideas carry over."
],
[
32.3,
"It has a sampling distribution, a standard error,"
],
[
34.8,
"and confidence intervals."
],
[
36.7,
"Part seven explains in math"
],
[
38.5,
"what it means to control for a variable."
]
],
"prob-to-stats": [
[
0.6,
"Let's start with what statistics is."
],
[
2.6,
"Statistics is about learning something about a whole group, the population, from data on part of it, which we call the sample."
],
[
10.6,
"Which individuals land in the sample is random."
],
[
13.6,
"Probability is the language we use to describe that randomness."
],
[
17.6,
"The two directions are worth keeping apart."
],
[
20.6,
"In probability theory, we assume we know the population and we ask which samples are likely,"
],
[
27.6,
"like how likely 7 heads in 10 flips of a fair coin."
],
[
32.6,
"In statistics, we go the other way."
],
[
35.6,
"We don't know the theory, but we see the sample."
],
[
38.6,
"We see 7 heads and we ask what observing the 7 heads tells us about some truth of the underlying coin."
]
],
"sampling": [
[
1.1,
"In practice, you can rarely look at everyone."
],
[
4.6,
"Measuring every customer, every store, or every transaction is too expensive or too slow."
],
[
10.1,
"All the population includes people who haven't arrived yet."
],
[
14.1,
"So instead, you collect data on samples drawn from the population."
],
[
19.1,
"The picture shows the idea."
],
[
21.1,
"A big population of dots and a random handful of them highlighted."
],
[
25.1,
"That handful is all you get to see."
],
[
27.1,
"Press the button to draw another sample."
],
[
29.1,
"Every time, you get different dots."
],
[
32.1,
"The hope is that the sample looks like the population."
],
[
36.1,
"So when you learn from it, it carries over to everyone."
],
[
40.1,
"Random sampling is what makes the hope reasonable and the rest of the module makes it precise."
]
],
"pop-sample": [
[
0.4,
"Each population quantity has a sample analog. The population mean, mu, is estimated by the sample mean, X bar."
],
[
8.4,
"The population variance, sigma squared, by the sample variance, S squared."
],
[
14.4,
"The same goes for covariance, and we will see for regression slope."
],
[
19.4,
"Beta 1, you can think about that as a population slope, and beta 1 hat is a slope we compute from our data."
],
[
27.4,
"For example, to learn the average return of the market, the population might be all tradable assets, and the sample is the stocks in a broad index."
],
[
37.4,
"Or for a retailer, you can think about the population of every loyalty card holder, and the sample is 400 customers who answered a survey."
],
[
46.4,
"Convention helps. Typically, we use Greek letters for population quantities, which we don't know, and Latin letters, or hats, for the numbers we compute from the sample."
],
[
58.4,
"But for that application, we need to be registered."
],
[
60.4,
"If you're listening to Greek letters in English, we may not be registered for"
],
[
74.2,
"language problems, which means that in English, this is a big benefit foridée."
],
[
76.4,
"We have a variety of the appropriate options of the application."
],
[
78.4,
"Most people don't know you could use that, but in English, we need to keep a number of measures in itself"
]
],
"point-estimates": [
[
0.2,
"Here are two words that sound alike but really mean different things."
],
[
4.3,
"A point estimate is one number, like 45 dollars. An estimator is a recipe that produced that"
],
[
12.2,
"estimate. This is a formula you apply to whatever sample you happen to get."
],
[
17.4,
"The distinction matters because the recipe is fixed but the sample is random. Apply the same"
],
[
23.8,
"recipe to a different sample and you get a different number. So questions, is this a good"
],
[
29.0,
"estimate? And if this is a good recipe, are different? And only the second has a clear answer."
],
[
35.2,
"So we are judging recipes by how they behave across all samples we might have drawn."
]
],
"estimators": [
[
0.2,
"Here are the recipes for estimators we use most. The sample mean adds up the observations"
],
[
6.1,
"and then divides by n the number of observations. The sample variance averages the square deviations"
],
[
12.4,
"from the mean, dividing by n-1. The sample covariance does the same with products of"
],
[
19.1,
"deviations of x and y, and the correlations rescales the covariance by the two standard"
],
[
25.2,
"deviations so that it lies between minus one and positive one. In Python, these are one-liners"
],
[
32.6,
"and pandas call them. You just use mean, var, clv, and corr. You might wonder why when we calculate"
],
[
42.6,
"deviations we divide by n-1. Deviations from the sample mean are slightly too small because the"
],
[
49.2,
"sample mean is already computed from the same data. Dividing by n-1 corrects the fact that we have"
],
[
55.8,
"already used the sample mean. Here's one trap. NumPy's var function divided by n unless you set"
],
[
64.3,
"ddof equal to one. So pandas divides by n-1 by default."
]
],
"try-sampling": [
[
1.0,
"Time to run a simulation."
],
[
3.0,
"On this slide, the left is the population."
],
[
6.0,
"The monthly span of 2,000 customers."
],
[
9.0,
"Like most spending data, it is skewed."
],
[
11.0,
"Most customers spend a little, and a few spend a lot."
],
[
15.0,
"The dashed line is the population mean, mu,"
],
[
18.0,
"and in real life, we almost surely won't know the true mean."
],
[
23.0,
"Press the button to draw one sample."
],
[
26.0,
"The blue dots are the 25 customers you happen to get."
],
[
29.0,
"And the orange line is their average X bar."
],
[
32.0,
"Press it a few more times."
],
[
34.0,
"You see X bar jumps around because each sample is going to be different."
],
[
38.0,
"Now press and draw 100 samples."
],
[
41.0,
"That might be too many, you can try to draw 10 samples."
],
[
44.0,
"The point is, the right panel collects all your sample means."
],
[
48.0,
"Now you can notice two things."
],
[
50.0,
"First, they are centered on mu,"
],
[
52.0,
"and they are much less spread out than the population itself."
],
[
56.0,
"The readout compares their spread with sigma over root n."
],
[
60.0,
"Then you can switch n to 5 to 100 and see how the spread changes."
],
[
65.0,
"This is the whole module in one picture,"
],
[
67.0,
"and the next slide, we're going to explain it."
],
[
70.0,
"So, have you just taken over the next slide?"
],
[
72.0,
"If you look at the small sample,"
],
[
73.0,
"the one with the small sample is on the same page."
],
[
74.0,
"If you look at the small sample,"
],
[
75.0,
"the number size is on the same page as an apple."
],
[
76.0,
"The main feature is on the same page as an apple."
],
[
77.0,
"There's one with this large sample."
],
[
78.0,
"And there's a lot of surgery."
],
[
79.0,
"You can see what you're using."
],
[
80.0,
"Here's a little bit."
],
[
81.0,
"There's a little bit more than a couple of things."
],
[
82.0,
"You can see how the line is moving in one picture,"
],
[
83.0,
"and let's see how the line is moving."
]
],
"xbar-rv": [
[
0.0,
"Here's the key shift in thinking. Once you have your data, your sample, X bar is just a number."
],
[
7.2,
"But before you draw the sample, X bar is a random variable, because which customers you're going to"
],
[
12.6,
"get from the sampling process is random. You'll throw this in this simulation. Every new sample"
],
[
19.2,
"is going to give you a different X bar. Now, because X bar is a random variable, it's going"
],
[
25.1,
"to have a distribution, which we call it sampling distribution. Like any distribution, it has a"
],
[
31.3,
"mean and a standard deviation. Knowing those two numbers tells us how good the recipe is."
]
],
"mean-var": [
[
0.2,
"Two facts describe the sampling distribution of X bar. Fact one, the mean of X bar is a population"
],
[
6.9,
"mean. On average, across all samples in my draw, X bar is right. We call this unbiased."
],
[
14.5,
"It's not systematically too high or too low. Fact two, the variance of X bar is a population"
],
[
21.4,
"variance divided by n. So the bigger the sample, the more tightly X bar clusters around the truth."
],
[
30.2,
"Now why should we care? Because those two facts tell us the recipe is going to be a good one."
],
[
36.1,
"Fact one tells us it's going to be right on average and fact two tells us it gets more precise as we"
],
[
42.1,
"collect more data. Remember the variance is going to be the population variance divided by n. As we draw"
],
[
49.2,
"more data, the number of observation n is going to increase and eventually the variance of X bar"
],
[
56.0,
"is going to be close to zero. So if you're curious where they'll come from, you can click"
],
[
61.7,
"through the optional box. Each fact just takes two lines to compute. Notice where the independence"
],
[
67.8,
"is used. It is what lets us add up the variances and that is why random sampling matters. Because"
],
[
74.6,
"if there's no random sampling, each draws might be correlated and we cannot apply this independence property."
]
],
"se": [
[
0.6,
"The standard deviation of the estimator has a special name, the standard error."
],
[
5.6,
"For the sample mean, it is sigma over the square root of n."
],
[
9.6,
"In practice, we don't know sigma, so we also plug in the sample standard deviation, s,"
],
[
15.6,
"to approximate the true population sigma."
],
[
20.6,
"Why is the standard error so much smaller than the standard deviation of the data?"
],
[
24.6,
"One customer can easily be far from the average."
],
[
28.6,
"But for the average of 100 customers to be far from, most of them would have to be unusual in the same direction."
],
[
35.6,
"And that rarely happens."
],
[
37.6,
"Because when you do a random sampling process, the highs and lows tend to cancel out each other."
],
[
43.6,
"Now notice the square root."
],
[
45.6,
"This tells us doubling the sample doesn't halve the standard error."
],
[
49.6,
"You need four times as many observations to cut it by half."
],
[
53.6,
"That is why precision gets quite expensive,"
],
[
56.6,
"and why companies run experiments on millions of users."
]
],
"two-coins": [
[
1.1,
"Let's see the sampling distribution in the simplest possible case."
],
[
5.2,
"A coin lands head with probability 0.66, and x is 1 for head and 0 for tails."
],
[
13.1,
"Flip it twice, the share of heads X bar can only be 0, 1 half, or 1."
],
[
19.4,
"Two tails has probability about a third times a third, that's about 0.12."
],
[
26.4,
"One of each can happen two ways, so its probability is 2 times a third times two thirds, that's about 0.45."
],
[
35.0,
"The reason is that you might have a head tail or a tail head, so it can happen two ways."
],
[
41.6,
"Now two heads has a probability essentially two thirds squared, that's about 0.44."
],
[
47.9,
"So this is the whole sampling distribution of X bar if we only do two flips, if we have"
],
[
53.2,
"a sample size equals to 2."
],
[
56.4,
"Now we can use the buttons to increase the number of flips."
],
[
59.7,
"This exact probability is computed from a binomial formula, that's not a simulation."
],
[
66.1,
"So two things can happen."
],
[
67.8,
"The distribution squeezes towards two thirds, which is essentially fact two at work."
],
[
74.7,
"And if you look at the shape, its shape turns into something like a bear curve."
],
[
80.1,
"Now hold on to that bell, and that's the subject in the next slide."
],
[
84.2,
"Thank you."
]
],
"lln": [
[
0.2,
"The first big result is the law of large numbers."
],
[
3.4,
"It says as the sample gets larger, the sample mean gets as close as you would like to the"
],
[
8.0,
"population mean."
],
[
9.4,
"It follows from two facts."
],
[
11.1,
"The center of X bar's distribution stays as mu, and it spreads sigma over root n, shrinks"
],
[
17.5,
"to zero."
],
[
18.5,
"A distribution that stays centered on mu, and whose spread goes to zero essentially piles"
],
[
23.9,
"up right on mu."
],
[
25.4,
"You can try it on your own on the right."
],
[
28.5,
"Flip the coin, and watch the running share of the heads."
],
[
31.3,
"Early on it swings widely, after a few thousand flips, it settles near two-thirds."
],
[
36.7,
"At a few classmates, everyone can start from a different place, and everyone ends up at"
],
[
41.1,
"the same number."
],
[
42.1,
"So that shaded funnel shows where 95% of paths should be at each sample size."
],
[
48.5,
"In some sense, you can think about this is how the insurance works, and you can think"
],
[
53.5,
"that as why casinos can always win in the long run, and why an online experiment with millions"
],
[
59.7,
"of users can measure conversion rate to a fraction of percentage points."
],
[
64.5,
"The law says nothing about the next flip, though."
],
[
67.6,
"After five heads in a row, tails is not due."
],
[
70.4,
"Thank you."
]
],
"small-samples": [
[
0.2,
"The law of large numbers has a dangerous flip side. If big samples give precise averages,"
],
[
5.9,
"small samples give noisy ones, and noisy averages end up at extremes. Each dot is a store."
],
[
13.4,
"Every one of those 200 stores has exactly the same true conversion rate, 10%. The only difference"
],
[
19.8,
"is how many visitors they had this month. The green dots are this month's top 10 stores,"
],
[
25.6,
"and the red dots, the bottom 10. Look at where they are. Almost all on the left. Among the small stores,"
],
[
33.3,
"press next month. A new set of small stores takes the top and the bottom dots."
],
[
40.2,
"The statistician Howard Weiner called sigma over root n the most dangerous equation,"
],
[
45.8,
"because ignoring it leads to expensive mistakes. The counties with the lowest and the highest kidney"
],
[
52.6,
"cancer rates are both mostly small rural counties. A foundation once poured money into small schools"
],
[
58.8,
"because small schools were over-represented among the best, and they were also over-represented among"
],
[
66.9,
"the worst. So before you reward the top store or fire the manager of the bottom one, you should"
],
[
72.6,
"always look at the sample size."
]
],
"clt": [
[
0.6,
"The second big result is called the central limit theorem."
],
[
3.6,
"Take the sample mean, subtract the population mean, and divide by standard error."
],
[
8.6,
"This theorem says when n is large, this standardized mean is approximately standard to normal."
],
[
15.6,
"And this holds whatever the population looks like."
],
[
19.6,
"Coin flips, dice, skew spanning anything with a finite variance."
],
[
24.6,
"Essentially, the law of flush numbers tells you where X bar ends up."
],
[
29.6,
"The central limit theorem tells you the shape of the arrow along the way."
],
[
34.6,
"A bell curve whose width is sigma over root n."
],
[
38.6,
"Now why should you care?"
],
[
40.6,
"Because the normal distribution is completely known."
],
[
44.6,
"If X bar is approximately normal, we can say how likely it is to be within any distance of the truth."
],
[
51.6,
"This gives us the margins of error, like 52% plus or minus 2."
],
[
57.6,
"And hypothesis tests, like whether the average is above 20."
],
[
62.6,
"And we never need to know the shape of the population."
],
[
66.6,
"So, let's see."
],
[
67.6,
"Let's see."
],
[
68.6,
"Let's see."
],
[
69.6,
"Let's see."
],
[
70.6,
"Let's see."
]
],
"clt-machine": [
[
0.9,
"Here's a machine for the central limit theorem. Pick a population on top. The left panel shows what a single jaw looks like. The right panel takes 2000 samples of size n, computes each sample mean, standardizes it, and plots a histogram. The green curve is the standard normal. Start with n equals to 1. The histogram is just a population. And for customers' span, it's going to be badly skewed. Now go to 2, 5, 10, 30. The skew melts away and the histogram"
],
[
30.8,
"hugs the bear curve. Then try the other populations. The die looks normal almost immediately. The coin is going to be lumpy for quite small n because sample mean can only take a few values. The rare big win, a 1% chance of $100, means hundreds of variations before it looks normal. Now what's the readout of the share? We're seeing plus or minus 1.96. It should be close to 95%. And this is the property"
],
[
60.1,
"of a standard normal distribution. Now here's the lesson. The central limit theorem always kicks in. But how soon depends on how skewed the population is. With very skewed outcomes like revenue per user, you need really large numbers."
],
[
76.1,
"But the central limit theorem tells us if we can send the sample size to infinity to as large as we want, eventually the standardized sample mean is going to follow that"
],
[
90.0,
"standard normal distribution."
]
],
"properties": [
[
0.5,
"Okay, let's collect what we have learned into a checklist for any estimator."
],
[
4.7,
"We want three things."
],
[
6.3,
"First, we want the estimator to be centered on the truth."
],
[
10.1,
"That is unbiasedness."
],
[
12.1,
"Second, it should get closer to the truth at the sample growth."
],
[
15.5,
"So eventually, that's going to be correct."
],
[
17.7,
"And this property is called consistency."
],
[
20.6,
"And third, it should have a convenient sampling distribution, ideally normal,"
],
[
24.8,
"so that we can build intervals and tests."
],
[
27.4,
"This is called asymptotic normality."
],
[
31.7,
"Why do we need more than unbiasedness?"
],
[
34.5,
"Consider a silly rival estimator, the average of the only first two observations."
],
[
40.8,
"Note it is unbiased because each observation has a mean mu."
],
[
45.9,
"But the estimator never improves."
],
[
48.7,
"Even with a million observations, it still uses the first two observations,"
],
[
52.6,
"so it's not going to be a consistent estimator."
],
[
54.9,
"The sample mean passes all three properties."
],
[
59.0,
"Fact 1 gives unbiasedness, the log of large numbers gives consistency,"
],
[
63.5,
"and then central limit theorem gives normality."
],
[
66.2,
"In part 6, we put OLS estimators through the same checklist."
],
[
70.2,
"And you'll see it passes too under some assumptions."
],
[
73.3,
"And those assumptions turns out to be the heart of this course."
],
[
76.1,
"The fact is true about the fact that there is no evidence."
],
[
77.0,
"It is true."
],
[
94.1,
"And this is true."
],
[
94.2,
"The effect is obtained a lot of mistakes between aünden."
],
[
95.0,
"And that is allowed to be noticed."
],
[
96.5,
"Of course, it's not something."
],
[
98.3,
"This is evidence that none of them are accepted,"
],
[
99.8,
"but the least unfortunate isn't it,"
],
[
100.6,
"and because this a while is something that운ус,"
],
[
102.4,
"it is pense 소 feedback."
]
],
"check-1": [
[
0.5,
"Before moving on, three quick questions to check your understanding."
],
[
4.3,
"Click on answer to see whether you got it and why."
],
[
7.4,
"Nothing here is graded."
]
],
"ci-idea": [
[
0.2,
"A point estimate is your best guess, but on its own, it doesn't tell anyone how much to trust it."
],
[
7.9,
"An estimate becomes much more useful when it comes to within a margin of error,"
],
[
12.6,
"x plus or minus some error. Here's the kind of sentence we would like to be able to say."
],
[
19.1,
"I estimated the average price of gas in Rochester last week. My estimate is $3.30."
],
[
25.9,
"The way I went about it, I had a 95% chance of ending up with $0.36 of the truth."
],
[
33.5,
"Notice the careful wording. The 95% describes the procedure, the way I made the estimate."
],
[
39.5,
"The question on the next slide is how to make such statement."
]
],
"interval": [
[
0.4,
"An interval estimate is a range of values, X bar minus some arrow to X bar plus some arrow, that is likely to contain the true parameter."
],
[
10.2,
"It comes with a confidence interval, the probability that the procedure captures the parameter 95% of the time."
],
[
18.5,
"Why do we set it to 95%, not 100%?"
],
[
21.8,
"The only interval that is certain to contain the truth is going to run from minus infinity to plus infinity, and that is not going to tell us anything."
],
[
30.4,
"Any useful interval is going to accept some chance of missing."
],
[
34.8,
"95% is a convention."
],
[
37.0,
"We can also see how to get to 90% or 99% instead."
]
],
"normal": [
[
0.2,
"Here's a warmup case. Forget estimation for a moment and take a standard normal random variable"
],
[
5.2,
"Z. Which interval contains Z 95% of the time? The answer is minus 1.96 to plus 1.96."
],
[
13.3,
"The shaded middle area is 95%, and each tail is going to have 2.5%."
],
[
19.8,
"Use the button to see the other common levels. For 90%, the cutoff is 1.645, and for 99%,"
],
[
27.4,
"it's about 2.58. More confidence means a wider interval. These three numbers are worth remembering"
],
[
34.7,
"because they are usually the very standard property for normal distribution."
]
],
"ci-build": [
[
0.1,
"Now let's see how to build the interval, one step at a time."
],
[
3.4,
"Clip next step as we go. Step 1, the central limit theorem says"
],
[
7.8,
"standardized mean is approximately standard normal. So just like z is going to lie between"
],
[
13.7,
"minus 1.96 to plus 1.96 with probability 95%. For now, pretend we know sigma."
],
[
21.9,
"Step 2, rearrange the inequality so that mu is in the middle."
],
[
26.2,
"We get X bar minus 1.96 standard errors, to X bar plus 1.96 standard errors."
],
[
32.0,
"That is 95% confidence interval. It gets narrower as n grows, as you can see."
],
[
38.3,
"Step 3, we don't actually know sigma, so we need to replace it with a sample standard deviation s."
],
[
44.6,
"You should recognize s over root n. It is the estimated standard error."
],
[
49.4,
"So the interval is the estimate plus or minus 1.96 standard errors."
],
[
54.2,
"You will use this recipe all the time."
],
[
57.4,
"Step 4, for other confidence intervals, swap 1.96 for 1.645 or 2.58."
],
[
64.4,
"For example, with 400 customers, an average $45.20 and a standard deviation of 50."
],
[
71.8,
"The standard error is 2.5, which you can verify on your own."
],
[
75.8,
"And then the interval is going to run about $40, 30 to $50."
],
[
79.8,
"Software uses the t-distribution instead of this 1.96, which only matters in small samples."
]
],
"ci-coverage": [
[
0.3,
"Here's what 95% confidence really means. Each line is a confidence interval from one"
],
[
6.2,
"sample of 100 customer ratings on a 1-5 star scale. The dashed line is the true mean rating."
],
[
12.9,
"It never moves. What moves is the interval. Draw 40 samples. Most intervals cross the dashed line."
],
[
19.8,
"A few in red is going to miss it. Now draw 1000 and look at the count. About 95% of the"
],
[
26.0,
"intervals contain the true mean. That is the promise. Not that this particular interval is"
],
[
31.3,
"right, but that the procedure is right 95% of the time. Now some experiments switch to 99%."
],
[
38.8,
"The intervals get wider and miss less often. Then go back to 95% and switch the population to monthly"
],
[
45.2,
"spend, the more skilled one. Now even with 100 customers, only about 92% of the intervals cover"
],
[
51.4,
"the truth. And with 10 consumers, about 83%. With skewed data, the central limit theorem needs"
],
[
57.8,
"more observations before the intervals can be trusted. At 400 customers, coverage is back near 94%."
]
],
"t-test": [
[
0.6,
"Confidence intervals and hypothesis tests are two sides of the same coin."
],
[
5.5,
"To test whether population mean equals to some value, mu zero, count how many standard errors you estimated from mu zero."
],
[
12.8,
"That count is called the t-statistics."
],
[
15.9,
"If the null hypothesis were true, t would be approximately standard normal."
],
[
20.9,
"So a value beyond plus or minus 1.96 would happen less than 5% of the time."
],
[
26.5,
"That is our rule. Reject at 5% level when the absolute value of t exceeds 1.96."
],
[
35.5,
"The p-value is the probability of getting an estimate at least this far from mu zero if the null hypothesis were true."
],
[
45.3,
"To give you an example, marketing claims consumers spent $40 on average."
],
[
50.4,
"Our survey says $45.20 with a standard error of 2.50."
],
[
57.4,
"The t-stat is going to be 5.2 over 2.5."
],
[
62.6,
"That's about 2.08."
],
[
65.8,
"And if you find the p-value, it's going to be about 0.04."
],
[
70.0,
"And therefore, we can reject the claim at the 5% level."
],
[
73.6,
"Equivalently, we can say that a $40 claim lies outside our 95% confidence interval."
],
[
82.5,
"You can see the test and the interval always agree."
]
],
"election": [
[
0.2,
"Now a real example of why intervals matter. This chart shows a 2016 election forecast."
],
[
6.1,
"The lines are the forecast number of electoral votes for each candidate over the campaign,"
],
[
10.9,
"and the shaded bands show the range each candidate had an 80% chance of falling in."
],
[
16.7,
"On election day, the average forecast about 302 electoral votes for Clinton and 235 for Trump."
],
[
25.0,
"Many people read this graph as Clinton wins, but look at the bands, they almost overlap a lot."
],
[
32.1,
"Eventually, Trump won 304 electoral votes inside this band. The forecast gave him roughly a 30%"
],
[
39.9,
"of chance, which is close to 1 in 3, since the 1 in 3 chance happens all the time."
],
[
45.8,
"The lesson for the business is the same. If you report the interval, not only the point estimate,"
],
[
51.4,
"and remember that an unlikely outcome is not an impossible outcome."
]
],
"py-inference": [
[
0.7,
"Everything we just did fits a few slides of assigns of Python."
],
[
4.9,
"The cell runs inside the page."
],
[
7.0,
"Press run."
],
[
7.9,
"The first run takes a little while because your browser downloads Python."
],
[
11.0,
"After that, it's going to be instant."
],
[
13.5,
"Part 1 flips 10,000 coins and prints the running share of heads after 10, 100, and 10,000 flips."
],
[
21.6,
"Part 2 drops 5,000 head samples of 30 customers and plots a histogram of their means."
],
[
26.6,
"Part 3 builds a 95% confidence interval from a sample of 400."
],
[
32.7,
"Now change things."
],
[
34.3,
"Set them to 2 and rerun."
],
[
36.2,
"The histograms of means turn skewed again."
],
[
39.1,
"Change the seed and the interval moves because you draw a different sample."
],
[
43.1,
"You can edit it freely."
],
[
44.4,
"The reset button brings all the original codes back."
]
],
"check-2": [
[
0.1,
"3 more questions on intervals and tests. The first one chips up a lot of people, so read the options carefully."
]
],
"cef": [
[
0.5,
"Now let's bring all of this to regression."
],
[
3.4,
"In live sessions, we saw the conditional expectation function,"
],
[
6.6,
"the average of y for each value of x."
],
[
9.6,
"This is the best prediction of y if you know x."
],
[
12.8,
"Suppose that function is a straight line,"
],
[
15.3,
"beta zero plus beta one times x,"
],
[
18.1,
"or take the straight line that best approximates it."
],
[
21.2,
"Beta y is going to be the slope,"
],
[
22.9,
"how much higher y is expected to be"
],
[
25.9,
"when x is one unit higher."
],
[
28.1,
"You can check it by subtracting the line"
],
[
30.1,
"at x from the line at x plus one."
],
[
33.4,
"Everything cancels except beta one."
],
[
36.4,
"Notice what we didn't write."
],
[
38.1,
"We didn't say that every y equals the line."
],
[
41.2,
"Individual observations scatter around the line."
],
[
44.1,
"The picture shows one observation,"
],
[
45.9,
"and the red segment is called the arrow."
],
[
48.5,
"Everything besides x that determines y."
],
[
52.0,
"And here's a connection to the first half."
],
[
54.2,
"Beta zero and beta one are population parameters,"
],
[
57.3,
"just like the population mean, mu."
],
[
60.1,
"We almost never see them."
],
[
62.0,
"We estimate them from the sample."
]
],
"ols-problem": [
[
0.2,
"How do we estimate the line? Any candidate line gives a prediction for each observation,"
],
[
6.0,
"and the gap between actual y and the prediction is a residual. We would like the residual to be small."
],
[
13.2,
"Ordinary least squares make that precise. Square every residual, add them up,"
],
[
18.6,
"and choose the intercept and slope that makes the sum as small as possible, and hence the name"
],
[
24.2,
"least squares. Why do we do squares instead of just sum? There are three reasons. Squares are smooth,"
],
[
31.6,
"so calculus gives you a nice formula. They punish the big myths, then the several small myths,"
],
[
39.1,
"and they link regression back to the sample mean. If you look for a single number that minimizes the"
],
[
45.2,
"sum of square deviations, in other words, you assume beta1 always equal to zero, and you just estimate"
],
[
52.6,
"beta0, then the best sample estimate is going to be y bar, the sample average of your outcome variable y."
],
[
62.8,
"Regression with only a constant gives you the sample mean, and that's nice because everything"
],
[
67.8,
"from the first half is going to apply."
]
],
"fit-line": [
[
0.2,
"Let's minimize the sum of squares by hand. These are 40 neighborhoods from Boston housing data you"
],
[
5.2,
"have seen in class. Median home value against the average number of rooms. The red segments are the"
],
[
10.7,
"residuals of your line. Use the two sliders, one for the slope and one for the height of the line"
],
[
16.0,
"at the average number of rooms. Watch your sum of squared arrows at the button. Take show square"
],
[
21.4,
"arrows to see them as actual squares. These squares make the total area of the squares as small as"
],
[
27.0,
"possible. The right panel helps. For each slope, it shows the smallest sum of squares you could get"
],
[
34.3,
"with its best height. It is a bowl with a single bottom and your line is the orange dot. If the dot"
],
[
42.5,
"sits above the bowl, your height is off. Try to reach the bottom, then press show the least squares line"
],
[
48.9,
"to check. Did you notice that the best height is always the average home value? The least square"
],
[
55.9,
"lines always pass through the points of the means. That is the first of the two OLS equations on the next"
],
[
63.3,
"side."
]
],
"ols-derive": [
[
1.2,
"Here's where the OLS formula comes from."
],
[
4.5,
"Let's click through the steps."
],
[
7.0,
"Step 1, we want the intercept and the slope that minimizes the sum of square residuals."
],
[
12.3,
"At the minimum, the derivative with respect to each of them is going to be 0."
],
[
17.0,
"Step 2, setting the derivative with respect to the intercept to 0 sets the residuals sum to 0."
],
[
24.0,
"Rearrange, the intercept equals to y bar minus the slope times X bar,"
],
[
28.9,
"which means the line passes through the points of means."
],
[
33.9,
"You just saw that property in the last slide."
],
[
37.0,
"Step 3, setting the derivative with respect to the slope to 0 sets that the residuals weighted by x also sum to 0."
],
[
46.1,
"Step 4, plug the intercept into the second equation and solve."
],
[
51.3,
"The slope is the number of cross products of derivations divided by the sum of square derivations of x."
],
[
57.6,
"Divide top and bottom by n times 1, and it is the sample covariance over the sample variance of x."
],
[
66.9,
"Step 5, the check."
],
[
68.3,
"In the Boston data, the covariance of room, the value is 0.49."
],
[
73.6,
"The variance of rooms is 0.49, and the ratio is 9.1."
],
[
79.3,
"That's about $9,100 per room."
],
[
81.9,
"The formula is built entirely from the things we have met in part 1."
]
],
"ols-population": [
[
0.0,
"Here's a neat way to see what OLS is doing. The population regression line, the best linear"
],
[
5.5,
"approximation to the conditional expectation function, has a slope equal to the population"
],
[
10.5,
"covariance of x and y divided by the population variance of x. Now look at the OLS formula."
],
[
18.1,
"It is exactly the same, which is population quantity replaced by sample analog,"
],
[
23.7,
"the sample covariance over the sample variance. OLS is a sample version of the population"
],
[
29.5,
"regression. That gives us consistency for free. There are a lot of large numbers, the sample"
],
[
35.1,
"covariance converges to the population covariance, and the sample variance to the population variance."
],
[
40.5,
"To the ratio, the OLS slope converges to the true population slope. With enough data, OLS finds"
],
[
47.3,
"the population line. But be careful about what the population line is. It describes how the average"
],
[
53.4,
"of y changes with x. Whether that is a causal effect depends on what is hiding in the error term."
],
[
61.2,
"That question is indeed what this course is going to be about."
]
],
"residuals": [
[
0.0,
"The two equations from the deviation holding every sample automatically gave OLS residuals some very useful properties."
],
[
9.0,
"The residuals always sum to 0. They are always uncorrelated with x."
],
[
14.0,
"The line always pass through the point of the means."
],
[
17.0,
"And the total variation in y splits neatly into the part explained by the line and the residual part,"
],
[
24.0,
"which is what makes R-squared a share between 0 and 1."
],
[
28.0,
"If the Boston data R-squared is 0.48."
],
[
31.0,
"Now the trap."
],
[
33.0,
"Because the residuals are uncorrelated with x by construction, checking that correlation tells you nothing."
],
[
39.0,
"It will always be zero."
],
[
41.0,
"Whether the true error everything else that drives y is related to x is an entirely different question."
],
[
47.0,
"And it is the question behind omitted variable bias."
],
[
50.0,
"You cannot answer it by just looking at the residuals."
],
[
53.0,
"You have to argue it from how the data were generated."
],
[
57.0,
"That is why this course spends so much time on research designs, which is to think about how the data generating process looks like."
],
[
66.0,
"And therefore, if not, if not, how the data gets replicated, or more into a certain way."
],
[
67.0,
"I will not have the manner in terms of making this case."
],
[
68.0,
"I will wait until you see it from now on the left there."
],
[
69.0,
"And I will wait until thismiyor."
],
[
71.0,
"And I will wait until you see it from now on the left."
],
[
72.0,
"And thanks for the fact that that I have been doing this,"
],
[
73.0,
"I will wait until the next step in the next step."
],
[
75.0,
"That is what I have done at the beginning of this week."
],
[
76.0,
"Somehow, you will have been rabidated by the question."
],
[
78.0,
"I am the other hand."
],
[
79.0,
"And then everything is going to be the same thing."
],
[
81.0,
"I am so excited about the answer."
],
[
82.0,
"In the first place in the room, we are not a single person at theweekly field,"
],
[
83.0,
"but with everyone on the right."
],
[
85.0,
"Themediate region, a lot of this world,"
]
],
"dummy-x": [
[
0.4,
"One special case is worth seeing in math, because we use it constantly."
],
[
5.1,
"Suppose x is a w variable, 1 for the treated group and 0 for everyone else."
],
[
10.2,
"Work out the two sums in the OLS formula."
],
[
12.8,
"Both contain the same factor, n times the share treated times the share not treated."
],
[
18.5,
"In the ratio, it cancels."
],
[
20.9,
"And what's left is the mean of y among the treated minus the mean among untreated."
],
[
25.6,
"The intercept is the mean of the untreated group."
],
[
28.6,
"So this regression of dummy is just a comparison of two means."
],
[
33.3,
"And the regression standard error is a standard error of that difference."
],
[
36.6,
"That is why, when we analyze random experiments later on, we simply regress the outcome on a treatment dummy."
]
],
"py-ols": [
[
0.0,
"Let's confirm this all in code. The cell loads the 506506 Boston tract, computes the slope and intercept with the formulas we derived, and compares them with the covariance over variance version, and with LAMPi's own fitting function. All three agree, 9.1."
],
[
18.4,
"Then checks the guarantees. The residuals sum up to 0, up to rounding. Their correlation with rooms is 0, and R squared is 0.48."
],
[
27.4,
"Try replacing rooms with S stat, the share of lower status residence. You'll get a negative slope, and the residual facts you hold because they always do."
]
],
"slope-rv": [
[
0.4,
"Just like X bar, the OLS slope is also a random variable."
],
[
4.9,
"A different sample is going to give you a different estimated regression line."
],
[
9.2,
"Now let's see it."
],
[
10.9,
"Pretend the 506 Boston tracks are the whole population."
],
[
14.2,
"Its regression slope, the dash orange line, is 9.1."
],
[
17.9,
"Now draw a sample of 25 tracks and fit a line."
],
[
21.4,
"The blue dots are your sample and the blue line is fit."
],
[
25.9,
"Draw a few more."
],
[
27.1,
"The line wobble around the true population line."
],
[
29.9,
"Pretend draw 200 samples and look at the histogram of slopes on the right."
],
[
34.4,
"It centers close to 9.1 and roughly bell-shaped."
],
[
37.9,
"3-2-100 tracks and then 400, the histogram narrows."
],
[
42.4,
"Everything we said about the sample mean carries over to the slope."
],
[
46.4,
"It has a sampling distribution centered near the truth with a spread that shrinks like 1 over root n."
],
[
53.4,
"The standard deviation of that distribution is the standard error of the slope."
],
[
57.9,
"Did it work on a branch that stabilizes."
],
[
72.4,
"Magic?"
],
[
72.9,
"The standard deviation for certain forces from the ground."
],
[
76.4,
"抓 aDEN- Stories of Fire on the ground."
]
],
"se-beta": [
[
0.3,
"Here is the formula for the standard error of the slope. It is the standard deviation of the"
],
[
4.5,
"error term divided by the square root of n times the standard deviation of x. In practice, we"
],
[
10.1,
"estimate the error standard deviation with the standard error of the regression, the typical"
],
[
14.7,
"size of a residual. The formula gives three levers. More data shrinks it. Through the same square"
],
[
22.0,
"root law, less noise shrinks it. If other factors move by less, the line is easier to see. And"
],
[
28.9,
"finally, more spreading x also shrinks it. If all your houses have six rooms, you can learn"
],
[
34.3,
"what the seventh room is worth. If we range from four to nine rooms, the slope is more precisely"
],
[
40.6,
"pinned down. In the Boston data, 6.62 divided by the square root of 506 times 0.70 gives you"
],
[
49.2,
"0.42. That's the standard error of the software reports. The optional box shows where the formula"
],
[
55.8,
"comes from. Substitute the true model into the OLS formula and the slope equals the true"
],
[
61.2,
"slope plus a weighted average of the errors. That one line gives unbiasedness the variance"
],
[
67.1,
"and through the central limit theorem the normality, which I'm not going to show you in details"
],
[
71.6,
"in this course."
]
],
"se-knobs": [
[
0.2,
"Now let's pull the three levers."
],
[
2.2,
"The model is y equals 1 plus 2x plus noise, so the true slope is going to be 2."
],
[
8.2,
"The left panel shows one sample and its fated line."
],
[
11.2,
"The right panel shows the slopes from 500 samples just like it."
],
[
15.2,
"Move the sample size up and watch the histograms narrow."
],
[
18.2,
"Increase the noise and it widens."
],
[
20.2,
"Now increase the spread of x, it narrows again, even with the same number of observations."
],
[
25.2,
"Under the histogram, compare the actual spread of 500 slopes with the formula, they match."
],
[
31.2,
"Think about which lever is cheapest in business setting."
],
[
35.2,
"More observations cost a lot of money."
],
[
38.2,
"Next noise can come from better measurement or from controlling for other factors."
],
[
43.2,
"And more variation in x can come from the true design."
],
[
46.2,
"For example, you can test a wider range of prices in a pricing experiment."
]
],
"assumptions": [
[
0.0,
"So far, we have been saying under assumptions. Here they are. There are four. Assumption 1,"
],
[
5.1,
"the error has mean 0 given x. Everything else that drives y is unrelated to x on average."
],
[
11.2,
"This one makes OLS unbiased. And it is what allows a causal rating of the slope."
],
[
17.0,
"It is an assumption the rest of the course is about. Assumption 2, a random sample."
],
[
22.8,
"Subservations are independent draws. This is what lets the law of large numbers and central"
],
[
27.2,
"limit theorem work. Assumption 3, no extreme outliers, so that no"
],
[
32.5,
"single observation drives the result. Assumption 4, homoscedasticity. The spread of the arrow"
],
[
38.8,
"is the same at every value of x. It is needed only for the simple standard arrow formula."
],
[
44.6,
"And it is actually not always required."
]
],
"inference-beta": [
[
0.0,
"Now the payoff. Since the slope is approximately normal with a known standard error,"
],
[
5.0,
"we build intervals and test exactly as we did for the mean. The estimate plus or minus 1.96"
],
[
10.8,
"standard errors gives the confidence interval. And the estimate divided by the standard error"
],
[
15.1,
"gives the t stats for the noun that the slope is 0. Here is the Boston regression. The slope"
],
[
20.5,
"is 9.1 with a standard error of 0.42. The 95% confidence interval runs from 8.28 to 9.92."
],
[
29.4,
"So an extra room goes with roughly $8,300 to $9,900 higher than median value. The t-statistics"
],
[
38.3,
"is 21.7, far beyond 1.96. So this association is not a fluke of sampling."
],
[
46.0,
"Two remarks. Not a fluke, that's the mean causal. Bigger homes come with other things, like we saw"
],
[
52.1,
"with omitted variables. And software uses the t-distribution instead of the normal, which"
],
[
57.0,
"is why it prints 9.93 instead of 9.92. With more than about 100 observations, the difference"
],
[
63.2,
"between a t-distribution and a normal distribution really doesn't matter."
]
],
"py-se": [
[
0.0,
"This cell computes the standard error of the slope by hand."
],
[
3.0,
"Twice."
],
[
4.0,
"First, with the classical formula, the standard error of the regression divided by the root"
],
[
9.0,
"n times the standard deviation of x."
],
[
11.0,
"Then with the robust formula, which lets the error variance differ across observations."
],
[
16.0,
"It adds the data directly."
],
[
18.0,
"It resamples 500 or 6 tracks 2,000 times, re-estimates the slope each time, and measures"
],
[
24.0,
"how much the slope moves."
],
[
26.0,
"Write and compare."
],
[
27.0,
"The resampling agrees more with the robust standard error, not the classic one."
],
[
31.0,
"This is telling us assumption 4 seems to fail."
],
[
35.0,
"That the variance of the noise is not constant across different acts."
]
],
"check-3": [
[
0.7,
"There are three questions on standard arrows of the slope, the second line is a trap from the earlier in a new form."
]
],
"anatomy": [
[
0.5,
"What does it mean mathematically to control for a variable? Regression anatomy gives a clean"
],
[
6.9,
"answer. Take the regression with two variables, x1 and x2. The coefficient on x1 equals a simple"
],
[
14.1,
"regression slope, but not on x1 itself. First, regress x1 on x2 and keep the residual,"
],
[
21.0,
"that's called x1 tilde. That is a part of x1 that x2 cannot predict. Then the coefficient on x1"
],
[
28.9,
"is a covariance of y with a residual divided by its variance. The two panels show it with the Boston"
],
[
35.4,
"data. On the left, value against rooms, slope 9.1. On the right, value against a part of rooms that is"
],
[
43.3,
"unrelated to the LSTAT, the share of lower status residents. The cloud is narrower because some of the"
],
[
49.5,
"variation in rooms was really variations in neighborhood status. A slope is 5.10, which is"
],
[
56.3,
"exactly the coefficient on rooms when you regress value of rooms on LSTAT altogether. Controlling for"
],
[
63.5,
"LSTAT means comparing tracks with more or fewer rooms than their LSTAT would predict. That is"
],
[
71.1,
"a precise version of holding LSTAT constant."
]
],
"ovb-math": [
[
0.0,
"In the live session we used omitted variable bias formula. Here is where it comes from in three lines."
],
[
5.0,
"The short regression slope is the covariance of y and x, 1 over the variance of x1."
],
[
11.0,
"Substitute the long regression for y, the covariance splits into pieces."
],
[
16.0,
"The constant drops out, the x1 piece gives the long coefficient,"
],
[
20.0,
"the x2 piece gives gamma times the slope from regressing x2 on x1, which we call delta."
],
[
26.0,
"And the residual piece is zero, because long regression residuals are uncorrelated with x1 by the OLS equations."
],
[
34.0,
"So the short slope equals the long slope plus gamma times delta."
],
[
39.0,
"In Boston, the short regression says 9.1 per room."
],
[
43.0,
"The long regression with L-stat as control says 5.10."
],
[
47.0,
"L-stat lowers the value by 0.64 per point,"
],
[
53.0,
"and tracked with one more room has 6.24 points lower L-stat."
],
[
59.0,
"Minus 0.64 times minus 6.24 is about plus 4."
],
[
66.0,
"And 5.1 plus 4 is just 9.1."
],
[
70.0,
"As you can see, the formula holds exactly in every sample."
],
[
73.0,
"The difference between gutoring is about the range of 2. Near range,"
],
[
92.0,
"and 3.4 points of outbreak, and 4.2 points moyen."
]
],
"py-fwl": [
[
1.0,
"One last co-cell, it runs the long regression with long pi, then checks both results."
],
[
7.1,
"The purge regressor's slope matches the long coefficient on rooms, 5.1, and the short slope"
],
[
12.4,
"equals the long slope plus gamma times delta."
],
[
14.7,
"Run it if you like, swap the rows of the two variables."
]
],
"check-4": [
[
0.6,
"Two final questions on multiple regression and omitted variables."
]
],
"summary": [
[
0.0,
"Let's wrap up. The sample mean is a random variable, centered on the truth with standard"
],
[
4.6,
"error sigma over root n. The law of large number said it converges to the truth, and its flipside"
],
[
10.3,
"warns that the small sample produces extremes. The central limit theorem says its standardized"
],
[
15.1,
"version is approximately normal, which gives us confidence intervals. We estimate plus or minus"
],
[
21.3,
"1.96 standard errors and test based on the t-statistics. OLS minimizes the sum of square"
],
[
28.0,
"residuals. Its slope is the sample covariance over the sample variance, a sample analog"
],
[
33.5,
"of the population regression. The same idea applies. It has a standard error that shrinks"
],
[
38.3,
"with more data, less noise, and more spreading x. And it rests on four assumptions. The first,"
],
[
45.1,
"that other factors are unrelated to x, is what the rest of this course is about. Finally,"
],
[
51.5,
"controlling for a variable means using only the variation it cannot predict, and that"
],
[
56.6,
"gives the omitted variable bias formula."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook. It has"
],
[
5.3,
"everything from those slides, a few short exercises, and the same regressions with statsmodels,"
],
[
10.6,
"the package we have used in class. Here we learned when a regression gives a good estimate of the"
],
[
16.3,
"population line. Next, the live session takes on the harder question, why is that line a causal effect?"
],
[
23.1,
"We begin with potential outcomes and randomized experiments, and we're going to see you there."
]
]
};
