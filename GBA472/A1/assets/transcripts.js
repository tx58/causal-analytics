// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
1.0,
"Welcome to this module."
],
[
3.3,
"Every number we compute comes from a sample."
],
[
6.3,
"So how close is the sample number to the truth?"
],
[
9.3,
"Two results answer that question, the law of large numbers and the central limit theorem."
],
[
14.3,
"Once we have them, we use them to build confidence intervals."
],
[
18.8,
"You can watch this like a video with the slides advancing on their own or you can go at your own pace."
],
[
24.8,
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
"Fact 1 gives unbiasedness, the law of large numbers gives consistency,"
],
[
63.5,
"and then central limit theorem gives normality."
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
"1.96 standard errors and test based on the t-statistics."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook."
]
]
};
