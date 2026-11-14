// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
0.0,
"Hello. In this module, we'll talk about the assumptions behind OLS, what they say, why we need them, and what to do when some fail."
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
0.0,
"The module has four parts."
],
[
1.9,
"Part one: why we can trust OLS, and the four assumptions behind it."
],
[
6.7,
"Part two: assumption one, which decides whether a coefficient is a causal effect."
],
[
12.9,
"Part three: the other three assumptions, and the standard errors."
],
[
17.2,
"Part four: heteroskedasticity, which is what happens when assumption four fails, and the one-line fix in Python."
],
[
25.1,
"The Python cells on the page load the four data files for you."
]
],
"why": [
[
0.0,
"Why should we trust OLS? Because we want to show that estimators have three nice properties, the same three when we talk about the sample mean estimator."
],
[
11.0,
"The first one is called unbiasedness. On average, across samples, beta hat should equal the true beta. The second one is consistency. With more and more data, beta hat should converge to the true beta."
],
[
23.0,
"And the third property is called asymptotically normal. That says in large sample, beta hat is going to be normally distributed, which is going to give us confidence intervals and hypothesis tests."
],
[
35.0,
"OLS estimator has all the three nice properties, but under four assumptions. So let's look at those assumptions."
],
[
44.0,
"For this course, focus on the idea and the intuition behind each assumption, not the math."
]
],
"try-sampling": [
[
0.0,
"Let's first see the three properties in a simulation. In this population of house example, the assumptions hold, and the dashed line is the truth. Now draw one sample. You can see OLS fits a line that's pretty close to the truth but not equal. Now draw 500 samples. On the right-hand side, the histogram of the slopes you can see is concentrated and is centered on the true slope. And this is unbiasedness."
],
[
26.0,
"Now if we have more houses per sample, you can see the distribution tightens and that is consistency. And finally, if we look at the curve, it looks so much like a normal curve, right? That is the third property, asymptotic normality."
]
],
"four": [
[
0.0,
"Here are the four assumptions that guarantee the three nice properties. We'll go through them one by one, starting from the first, which is the most important assumption."
]
],
"a1-linear": [
[
0.0,
"Assumption one has two halves. The first half says, in the population, Y equals beta zero plus beta one times X, plus an error term u. And the betas enter in a linear way. Something like beta zero squared would perhaps violate it."
],
[
18.0,
"And notice here, we have linear in parameters, not in X. And therefore a model with X squared is just fine, because the betas still enter the equation linearly. So this half is not the strong part of the assumption."
]
],
"a1-mean": [
[
0.0,
"The second half is actually the critical one. The expected value of u given X is zero. The first half put no structure on the error. The second half says more than the error is zero on average, it says the error is zero on average at every value of X. In other words, the factors we left out are unrelated to X. We say that u is mean independent of X."
]
],
"a1-implies": [
[
0.0,
"Now let's put the two halves together. Take the expected value of both sides given X. Now we have beta zero plus beta one X stays because once we know X, it's just a number. And expected value of u, conditional on X, is zero, that's by the second half of the assumption. So the expected value of Y given X is going to be a line."
],
[
22.0,
"Now does this ring a bell? It's exactly where the regression started, where we want to estimate or model the conditional expectation. Now remember, a crosstab estimates the conditional expectation cell by cell. Regression assumes it is going to be a straight line. Assumption one says the same thing."
]
],
"a1-picture": [
[
0.0,
"Here's the assumption one in a picture. Fix the value of X, let's say 15, many values of Y are possible there because the errors differ."
],
[
9.0,
"The assumption says that the distribution of Y at 15 and at any other X is centered exactly on the population regression line."
],
[
18.0,
"Now switch the picture to an error with mean 8 to see what not centered looks like."
]
],
"a1-positive": [
[
0.0,
"What if this assumption fails? Suppose the error is always positive, then it cannot have mean zero, and every point is going to lie above the true line, the dashed line."
],
[
11.0,
"OLS draws the line closest to these points, and that is not going to recover the true line."
],
[
16.0,
"So when the assumption fails, our estimate is going to differ from the true population parameters."
],
[
22.0,
"Here is an example where only the intercept is off."
],
[
26.0,
"When the mean of the error changes with X, the slope is also going to be off."
]
],
"a1-causal": [
[
0.0,
"Why does assumption 1 also imply causality? To estimate a causal effect, remember, X must be randomly assigned, or as if randomly assigned. Assumption 1 says exactly that, in the language of regression. The other factors, the ones in u, are unrelated to X. In the language of potential outcomes, if the assumption holds, there is no selection bias. When is that likely? Let's look at an example."
]
],
"a1-wage": [
[
0.0,
"Suppose that in the population a wage depends on education, on ability, and on random noise. We want the effect of education on wage. But our data have only wages and education. Ability is not measured. So we regress the wage on education and everything else that affects wage goes into the error term. Here the error u is ability plus the noise."
]
],
"a1-wage2": [
[
0.0,
"Does assumption one hold here? We need the expected value of u given education to be zero. Now the noise part is fine. The question is ability. Is average ability the same at every level of education? Perhaps not. You can imagine people with PhDs or MDs likely to have higher ability than people who stopped after high school. So assumption one would fail, and beta one is not going to be the true causal effect of education."
],
[
30.0,
"It picks up the effect of education, plus part of the effect of the ability that comes with it. This is the so-called omitted variable bias we discussed in the live session."
]
],
"a1-try": [
[
0.0,
"Here's a wage example in a simulation. To start from the truth, one more year of education raised the wage by exactly $2. The ability sits in the error term, and the slider sets how strongly it moves with education. With the correlation at 0.6, draw 200 samples. The estimates are centered near 3, not 2. OLS gives education the credit for ability. With the correlation of 0, it is centered on 2."
],
[
30.0,
"Now go back to 0.6 and raise the sample size to 10,000. The histogram gets narrow, but it stays in the wrong place. More data makes the estimate precise, but not going to make the estimate correct."
]
],
"a1-rce": [
[
0.0,
"The deeper problem here is that education is not randomly assigned. We cannot send people to college by the flip of a coin."
],
[
7.0,
"In a randomized experiment, subjects are assigned to the treatment at random, so the treatment is unrelated to any other characteristics, including everything in the error term."
],
[
18.0,
"Random assignment guarantees assumption 1, that is why in an experiment OLS recovers the true causal effect."
]
],
"a1-obs": [
[
0.0,
"With observational data, nobody assigns X. The best we can hope for is that X is as if randomly assigned, in the sense that assumption 1 holds."
],
[
9.0,
"The thought process is always the same. We're going to think: one, what else affects Y in real life, and two, which of those factors are not in my regression and so sit in the error term, and three, could any of them be correlated with X?"
],
[
25.0,
"If all those are yes, then we are in trouble of omitted variable."
]
],
"a1-error": [
[
0.0,
"Let's look at the error term more closely with the housing price example. For each house, the error is the gap between the price and the regression line. Click a house to see it. Two kinds of things are in that gap. The first is noise, an owner who priced carelessly or rounded $163,000 down to $160,000. The second is omitted variables, things that change the price and are not captured by size, like the neighborhood or the school district."
]
],
"a1-error2": [
[
0.0,
"Which of the two breaks assumption one? Noise is fine. Rounding goes up as often as goes down. For small houses, for larger ones, the noise has mean zero at every size. They cancel out each other."
],
[
13.0,
"The omitted variables are different. A big house is more likely to be in a good district because big houses are bought by families with kids who care about schools. So given a large house, the omitted factor is above the average. And the assumption fails."
],
[
28.0,
"The slope is not the effect of building a bigger house. Adding a hundred square feet doesn't move any house to a better school district. The remedy is multiple regression, bringing the omitted variable into the regression."
]
],
"a1-flexible": [
[
0.0,
"Assumption one is the most important assumption of the four, but it's less restrictive than it seems. First, relationship can be nonlinear in X, as we said, we just need it to be linear in parameters. Second, we can add more X's in the future, and whatever goes into the regression is no longer in the error term."
],
[
17.0,
"And if it still fails, OLS gives the best linear prediction of Y given X. So for the purpose of prediction, assumption one matters only a little. For the true causal effect of X on Y, it's going to be essential."
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
"a2": [
[
0.0,
"The other three assumptions are quicker. Assumption two, the data are a random sample, independent draws from one population. We want a random sample, not a selected one. To learn the effect of education on wages, we shouldn't sample only the students of one business school. They are students who already have a lot of education. And this is usually going to hold in cross-sectional data. It usually fails in time series, like monthly inflation, where this month's inflation rate depends on the previous month's."
],
[
29.0,
"We are not going to cover time series in this course, but you might learn that in the future."
]
],
"a3": [
[
0.0,
"Assumption 3 is a technical assumption. X and the error have finite fourth moments. This proves the consistency and normality. The intuition is that we don't want a few extreme observations to drive all the results. Don't worry about this. I won't test you on it. The next slide shows why extreme observations might matter."
]
],
"a3-try": [
[
0.0,
"This chart shows 88 houses and their regression line. Click anywhere to add one more house, or use the buttons."
],
[
7.0,
"Try the typo. A large house entered at $50,000 instead of $500,000. One observation lowers the slope by about 15%, and R squared now drops from 0.62 to 0.45."
],
[
20.0,
"Now let's try the big house on the line. You see it barely moves anything."
],
[
25.0,
"So an extreme point does damage when it's far from the other X's and also far from the true line."
],
[
32.0,
"So plot your data and check whether you have extreme points or so-called outliers."
]
],
"a4": [
[
0.0,
"Assumption 4 is homoskedastic errors. This is a Greek word. Homo means same, and skedastic means scattered. The points scatter around the line in the same way at every X."
],
[
11.0,
"Formally, it says the variance of the error doesn't depend on X. Compare the two pictures. On the left, the spread is the same everywhere. On the right, the points are still centered on the line, so the assumption 1 still holds, but you can see the spread grows with X."
],
[
28.0,
"This assumption is actually not essential. It only simplifies the formulas for standard errors. If it fails, the estimates don't change."
]
],
"role": [
[
0.0,
"What are those assumptions for? Two things. First, they justify the inference. Under the assumptions, the estimates are consistent and normal, and this is what gives us the nice confidence intervals and all the hypothesis tests. Second, they also remind us when we might get into trouble. Each assumption marks a situation where OLS might go wrong."
]
],
"se-formula": [
[
0.0,
"One last thing in this part. Where do the standard errors come from? Under the four assumptions, the standard error of the slope is the standard error of the regression divided by the square root of n times the standard deviation of X."
],
[
12.0,
"So more noise around the line means the larger standard error, more data means the smaller standard error, and more variation in X also means the smaller standard error."
]
],
"se-precision": [
[
0.0,
"Some intuition why variation in X helps. Look at the two panels. On the left, the X's sit in a very narrow range, and the lines from different samples point in quite different directions. On the right, X varies a lot, and the lines are almost coinciding with each other. So when you collect more data, try to go for a broader range of X. Your estimates will be much more precise."
]
],
"het-def": [
[
0.0,
"Now part 4 is about what would happen if assumption 4 fails. The error term decides how scattered the data are around the line. If its variance is the same at every X, the errors are homoskedastic. If the variance depends on X, they are heteroskedastic, scattered differently. This violates assumption 4 and it affects some of the inference we have done so far."
]
],
"het-dist": [
[
0.0,
"Here are the two cases. You can switch between them. Under homoskedasticity, the distribution of Y around the line has the same spread at every X, and under heteroskedasticity, the spread differs. Here the errors are more scattered when X is larger. In both cases, the distributions are centered on the line, so assumption 1 is untouched."
]
],
"het-clouds": [
[
0.0,
"In a scatter plot, it looks like this, homoskedastic, about the same scatter at every X, heteroskedastic, more scatter at larger X, or more scatter at smaller X. In all three, the points are on average still on the regression line."
]
],
"het-robust": [
[
0.0,
"So what goes wrong? With heteroskedastic errors, the simple formulas for the standard error are incorrect. But there's also good news. First, the estimates themselves are still fine, because the conditional mean is still a line. Second, there are standard errors that allow for heteroskedasticity. They are called robust standard errors, and they are right whether the errors are homoskedastic or heteroskedastic. Excel doesn't really give you that, but Python does."
],
[
30.0,
"If you're paid to analyze data, you should always report robust standard errors. In this course, we mostly use the default output, so in Python, it actually gives you the robust."
]
],
"het-houses": [
[
0.0,
"Now take a look at housing prices. The two tables have the same coefficients, only the standard errors differ. For square feet, the robust standard error gives 0.0196 against 0.0118, so about two-thirds larger. So the confidence interval is going to be wider. Now the conclusion survives. The slope is still about seven standard errors from zero, and the statistic is now called z instead of t. Now you don't need to know why that's the case."
]
],
"het-others": [
[
0.0,
"Here are three more examples. For diamonds, the wines and the earnings, the two standard errors are quite close because the data are nearly homoskedastic. A robust standard error can be sometimes even smaller than the default one, that's for the diamonds. The houses are the exception partly because a few large houses are quite far from the line."
]
],
"het-python": [
[
0.0,
"In Python, it just takes one more argument. Until now, we called fit with empty brackets. We can now write covariance type equals HC1 inside. Now HC1 is the usual type for a robust standard error. Now you can try to run the cell. The two tables is going to give the same coefficients but different standard errors. And summary now says covariance type HC1 instead of non-robust."
]
],
"het-compare": [
[
0.0,
"This also makes the same comparison for all four datasets. In every case, the coefficient is the same and the conclusion of the test doesn't change."
]
],
"het-try": [
[
0.0,
"Which standard error is right? Here's a simulation with the true slope of 2, where the spread of the error grows with X. We can draw 500 samples."
],
[
9.0,
"One: the histogram is centered on 2, so the estimates are fine. Two: the default standard error, the dashed curve, is too small. It claims more precision than we have."
],
[
18.0,
"Three: the robust standard error, the solid curve, matches the actual spread. As a result, the default 95% intervals contain the truth less than 95% of the time."
],
[
28.0,
"Now switch to the same spread at every X. Now the two agree. With the spread that shrinks, the default is too large. The robust one is right in all cases."
]
],
"het-check": [
[
0.0,
"How do you look for heteroskedasticity? Just plot the residuals against X. With homoskedastic errors, you'll see an even band around zero. For the housing example, you clearly don't. The larger houses have much larger residuals."
]
],
"check-2": [
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
"multi": [
[
0.0,
"Everything carries over to a regression with more than one X, with one addition."
],
[
5.4,
"Assumption one now says that the error has mean zero given all the X's."
],
[
10.7,
"That is why controls help: what you put into the regression is no longer in the error term."
],
[
16.7,
"Assumptions two and three are as before."
],
[
19.8,
"The new one is no perfect collinearity: no regressor is an exact linear function of the others."
],
[
26.4,
"For example, not the size in square feet and in square meters together."
],
[
31.7,
"And homoskedasticity is again optional: without it, use robust standard errors."
]
],
"summary": [
[
0.0,
"Let's wrap up."
],
[
0.9,
"Assumption one: linear in the parameters, and the error has mean zero at every X."
],
[
6.4,
"This is the important one."
],
[
8.6,
"If it fails, the estimate is not the causal effect, at any sample size."
],
[
13.6,
"Randomizing guarantees it."
],
[
15.4,
"With observational data, you have to argue for it."
],
[
19.3,
"Assumption two: a random sample."
],
[
21.6,
"Assumption three: no extreme outliers, so plot your data."
],
[
25.6,
"Assumption four: the same scatter at every X."
],
[
29.2,
"If it fails, the estimates are fine, but the default standard errors are wrong."
],
[
35.1,
"The fix is cov type equals HC1."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook."
]
]
};
