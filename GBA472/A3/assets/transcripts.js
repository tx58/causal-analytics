// Transcripts of the voice-over: the recordings' own words (faster-whisper large-v3-turbo, word timestamps),
// written by ../../code/make_audio.py; the slides without a recording are read by a text-to-speech voice
// (../../code/make_tts.py) and carry their script, sentence by sentence. Times are seconds into each clip.
window.TRANSCRIPTS = {
"title": [
[
0.2,
"Hello. In this video, I'm going to explain how to do the regression when we have a binary regressor."
],
[
8.3,
"I'm going to show you how to use Python to run regressions."
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
"This module has two parts."
],
[
1.8,
"In part one, the X in the regression takes only two values, zero and one: men and women, or treated and untreated."
],
[
10.4,
"You will see that the regression then compares two group means, and that its coefficient and its test are exactly the difference in means test you know from statistics."
],
[
20.9,
"In an experiment, this X is the treatment dummy."
],
[
24.5,
"In part two, you run regressions in Python: loading the data, two ways to write the regression, the rest of the numbers in Excel's output, the same code on more data sets, and a dummy X."
],
[
37.2,
"The five data files are listed here."
],
[
39.5,
"The Python cells on the page load them for you."
]
],
"bx-intro": [
[
0.2,
"So the data set I'm going to use in this lecture is the cps12.csv data set."
],
[
7.8,
"It's a current population survey conducted in 2012."
],
[
14.7,
"For regression, 1x is a binary variable. So far, we have only looked at examples where regressor is a continuous variable,"
],
[
22.8,
"such as the carats in the diamond example, the stock returns, and the wine ratings. The regression analysis can also be used when x is the binary variable or the dummy variable."
],
[
35.1,
"So those are the variables that can only take on two values, the values 0 and 1."
],
[
41.0,
"You can think about regressors like gender, drug treatment, like whether you can have in the treated group or the control group in a drug analysis,"
],
[
52.0,
"or the public traded firm like a firm can either be public traded or non-public traded which means it's private so those are the variables that can only take two values intrinsically so we call those variables the binary variable or the dummy variable so note typically when we see dummy variable those are the variables that can take finite a discrete number number of values so it can,"
],
[
76.3,
"in principle, be more than two values. So if a variable only takes two values, it's a special type of dummy variable."
],
[
84.3,
"It's also a binary variable. Now, although the coefficients are going to be calculated in exactly the same way when x is binary,"
],
[
92.3,
"actually, the formula of the beta 1 and beta 0 are still going to hold, regardless of x being continuous or discrete,"
],
[
99.9,
"the interpretation actually will change. And the reason is very simple. Because now x is not going to be a continuous variable,"
],
[
107.0,
"we wouldn't be able to use calculus on x. So beta 1 isn't going to be a slope anymore."
],
[
113.3,
"On the other hand, regression with a binary regressor actually has some equivalency to performing a difference of mean analysis."
]
],
"bx-data": [
[
0.2,
"So what does that mean? So let's take a look at this example. This table contains the CPS data,"
],
[
7.3,
"but let's split the data in reporting the average earnings for the men group and the women group working in the united states so this part reports the men subgroup this reports the women subgroup so if you are interested in the difference in earnings of men and women what we could do is to calculate the sample average earning for the men group in 2012 which is this number the mean earnings per hour for the women group,"
],
[
39.0,
"this is these numbers, and you get the difference, which is 3.8. So you see there's a difference in the means of earnings in the men group and the women group."
],
[
50.1,
"Now this is nice, we get the wage gap. The question is not only we want to know that men earnings are average 3.8 dollars per hour more than the average of women,"
],
[
61.1,
"we probably also want to learn whether the difference is going to be statistically significant, or this is just a result of sampling variation."
],
[
70.0,
"In other words, we want to do some statistical test on the difference of two group means."
]
],
"bx-econ": [
[
0.2,
"One thing I want to highlight here, which is a slight detour, is the difference between the statistic significance and economic significance."
],
[
8.1,
"So statistic significance and economic significance are two different things. So a coefficient can be statistically different or significant because it has pretty precisely estimated,"
],
[
21.7,
"but they might have a very small economic meaning, which means it's not going to be economically significant."
],
[
29.0,
"Now, what about this 3.8 wage gap? Now, we haven't discussed whether it's statistically significant,"
],
[
35.8,
"but it's for sure going to be economically significant. And the reason is that if you take a look at the women average earning,"
],
[
42.3,
"it's going to be $21.5 per hour. So this gap, 3.8, as we estimate from the sample,"
],
[
49.5,
"is almost like, I don't know, like 15% of the women earnings. So it's going to be economically significant."
],
[
58.0,
"It's a pretty big difference."
]
],
"bx-test": [
[
0.2,
"Now to test whether this number is statistically significant, then we need to do a hypothesis testing."
],
[
7.9,
"So what we're going to do is to test the null hypothesis that the men earning and the women earning are the same."
],
[
14.1,
"So the difference of the means of two groups equal to zero. The alternative hypothesis is that those two means are not"
],
[
23.3,
"the same, they're different from each other. We know to do the statistical test, we need to construct t-statistics,"
],
[
30.0,
"which depends on the standard error of the estimates. So we need to construct a standard error for those estimates of the two group means."
],
[
38.8,
"So how do we do that? It turns out this standard error of that coefficient has a very,"
],
[
45.0,
"very intuitive form. Although the form looks ugly, it's actually pretty intuitive. It actually consists of two parts in that square root."
],
[
53.8,
"The first part is kind of the standard error. It's actually the variance related to the first,"
],
[
61.8,
"the men mean earning estimator. This is sort of the variance associated with this, the first term."
],
[
69.2,
"Now, the second thing is going to be the variance related to the women mean earnings estimator."
],
[
77.1,
"So if you get the difference of those two things, it's actually going to sum up the variance of the male mean earning estimator and the female mean earning estimator."
],
[
89.1,
"They're going to get the sum of the variance and then take the square root, which will convert the variance back to the standard error."
],
[
97.1,
"So intuitively, the standard error of those difference mean estimator is going to combine the standard error of each of the two mean estimators,"
],
[
107.0,
"right?"
],
[
108.4,
"So you can also interpret sort of all the other hypothesis tests we have done before is to test that Y m is different from zero or not."
],
[
118.8,
"You can think about that as to test the difference between the men group and the constant zero,"
],
[
123.9,
"whether that difference is equal to 0 or not. In that sense, because this term is going to become a constant 0."
],
[
134.1,
"So the second term sort of disappear here. So you're only left with the first term,"
],
[
139.4,
"but we are back to a typical case when we just test whether one sample mean estimator is different from 0 or not."
],
[
147.9,
"But again, here, because we're going to take this difference of the two mean estimator, we have to combine the standard error of each."
],
[
157.0,
"So that's sort of the intuition here."
],
[
159.9,
"Now you can plug in all the values we have on this table, and you're going to get the standard error estimator to be 0.35."
],
[
168.2,
"So in other words, the t-stat for this null hypothesis is going to be the point estimate divided by the standard error estimator is going to be equal to 10.85."
],
[
183.4,
"So again, we could get the p-value,"
],
[
186.5,
"We plug in the t-stats and you get the p-value is going to be very close to zero."
],
[
191.8,
"So we're going to reject the null hypothesis at 95% of confidence interval, 99% confidence interval,"
],
[
199.2,
"almost any confidence interval because this p-value is so small."
],
[
203.3,
"So we're going to reject the hypothesis pretty confidently."
]
],
"bx-model": [
[
0.2,
"Okay."
],
[
1.8,
"Now we have to talk about tests of these two, the differences of the two means."
],
[
8.0,
"So how is it related to the regression when x is a binary theorem? So it turns out we could use regression to perform the exact same analysis,"
],
[
17.3,
"perhaps in a much more elegant way. So how do we do that? We could define the Yi as the average hourly earnings in 2012,"
],
[
26.0,
"which is the outcome variable we are interested in. Di is a dummy variable. It's going to take the value of 1 if the worker is a male,"
],
[
33.6,
"and 0 if the worker is a female. So we can interpret the population regression line with Di as a regressor as yi equals to the intercept plus beta 1 times ei,"
],
[
45.0,
"the dummy variable, plus ei, the residual term. Now remember, since the Di is not continuous,"
],
[
51.5,
"we cannot think of beta 1 as a slope, but Di only takes on two values."
],
[
56.9,
"So there's no regression line in some sense. So for this reason, we call the beta 1 the coefficient on Di instead of the slope."
],
[
64.4,
"So how do we interpret the beta 1? So let's basically take a look at what we have for each value of Di."
]
],
"bx-means": [
[
0.2,
"So remember the underlying assumption of linear regression is the assumption on the conditional mean. So you assume the conditional mean of the earning conditional on gender is going to be equal to this equation."
],
[
15.8,
"Now when d takes the value of 0, meaning the worker is a female. So the predicted or expected value of earning,"
],
[
24.1,
"when Di equal to 0, is going to be equal to beta 0 plus beta 1 times 0,"
],
[
29.5,
"because d takes the value of 0. So this is going to be beta 0."
],
[
33.7,
"Now, when Di equal to 1, when the worker is a male, the expected earning, conditional on the worker being a male,"
],
[
41.7,
"is going to be beta 0 plus beta 1 times 1. so that is beta 0 plus beta 1."
],
[
46.9,
"So the expected earning of a male worker is going to be beta 0 plus beta 1."
],
[
53.9,
"So as you can see here, the beta, if you take the difference between this equation and this equation,"
],
[
60.8,
"you get the beta 1 on the right-hand side, and then on the left-hand side is going to be exactly the difference between the two population means."
],
[
68.8,
"The population mean when the worker is a female and the population mean when the worker is a male."
],
[
74.9,
"So we are basically, you could interpret beta 1 exactly as the same thing as these difference test between two group means."
]
],
"bx-output": [
[
0.2,
"So here's the output. If we run that regression using the data, and you're going to see these two coefficients,"
],
[
7.6,
"the intercept and the male coefficient."
],
[
11.3,
"Now, the intercept coefficient is going to be the average earning of the female, which is the baseline group,"
],
[
18.0,
"which is the value when the male dummy takes the value of zero. Instead, the coefficient on the male is going to be the difference between the male group and the female group in terms of the earnings per dollar."
],
[
32.1,
"That's a male is going to earn 3.8 dollars higher than the female group."
]
],
"bx-compare": [
[
0.2,
"Now, interestingly, if you compare our regression outcome, this thing, with the the mean difference test we have done before,"
],
[
9.2,
"they compare this equation outcome with the mean test, you're going to see a one-to-one mapping between the coefficient to something in that mean test table."
],
[
19.5,
"The intercept estimate is exactly the same as the sample average earnings for women."
],
[
27.2,
"Now the sum of beta 0 hat and beta 1 hat is exactly the same as the sample average earning for men."
],
[
36.3,
"Now the beta 1 coefficient is exactly the difference estimator. We just talked about the difference between the average earning of the male group and the women group."
],
[
50.0,
"And also, you could see the statistical test actually the same. So using the previous table,"
],
[
56.9,
"we can construct the standard error and, of course, 95% of the confidence interval, which is going to be the difference plus minus 1.96,"
],
[
70.5,
"the critical value, times the standard error of that estimator. and we know the standard error of that estimator is going to be 0.35 and you can compute this value can be computed using the formula we talked about before and it's going to be this number the"
],
[
88.6,
"variance of the average sample mean estimator for the men divided by the number of observations we have in the men group and plus this variance of the sample mean for the women estimator divided by the number of coefficients we have for the women group."
],
[
105.7,
"This is a joint, this is a sum. Summing up the two variations for each subgroup is going to be the sum of the variance of this estimator."
],
[
118.3,
"Now, to get the standard error of that estimator, we have to take the square root."
],
[
123.0,
"If you plug all the numbers in, you're going to get the wage gap is going to be 3.11 to 4.49."
],
[
132.5,
"Now, you can also construct the confidence interval using the regression method, because we know this regression delivers a point estimate on beta 1 has 3.8,"
],
[
143.6,
"and the standard error on that estimate, 0.35. As you could also construct using the regression confidence interval formula,"
],
[
152.1,
"and you're going to get the exact same 95% confidence interval for beta 1."
]
],
"bx-ttest": [
[
0.2,
"To summarize, you can also do the hypothesis testing by calculating t-stats and calculate the p-value,"
],
[
7.9,
"and you can find the p-value is going to be, again, very close to zero."
],
[
12.9,
"So we're again going to reject the null hypothesis that the earning difference is equal to zero at basically any positive level of significance."
],
[
21.5,
"So hopefully these slides tell you the equivalence between running regression when x takes a binary outcome and a mean test on two different groups,"
],
[
33.4,
"conditional on the difference in the x values."
]
],
"bx-picture": [
[
0.0,
"Here is the regression on the data, as a picture."
],
[
3.2,
"Each dot is a worker."
],
[
4.5,
"The dots are spread sideways only so you can see them."
],
[
8.5,
"The short horizontal lines are the two group means, and the regression line goes through both of them."
],
[
15.3,
"At D equal to zero, it sits at beta zero hat, the mean of the zero group."
],
[
20.7,
"At D equal to one, it sits at beta zero hat plus beta one hat."
],
[
25.3,
"Switch the coding so that D equals one for women."
],
[
29.4,
"The intercept becomes the men's mean and the coefficient changes sign, while the gap keeps its size."
],
[
36.1,
"Then pick a smaller sample, say two hundred workers, and draw new samples."
],
[
41.5,
"The coefficient moves from sample to sample, and the spread of these estimates matches the standard error that the regression reports."
],
[
49.8,
"That is what a standard error measures."
]
],
"bx-experiment": [
[
0.0,
"The binary X you will meet most in this course is a treatment dummy."
],
[
4.4,
"In this experiment, researchers sent close to five thousand made-up job applications to ads in Boston and Chicago."
],
[
12.4,
"Each application got, at random, either a name that sounds White, like Emily or Greg, or a name that sounds African-American, like Lakisha or Jamal."
],
[
23.1,
"The outcome is one if the employer called back."
],
[
26.1,
"Regress the outcome on the treatment dummy."
],
[
29.2,
"The intercept, 0.0645, is the callback rate for African-American-sounding names, about six and a half percent."
],
[
38.7,
"The coefficient, 0.032, is the difference: three point two percentage points, about fifty percent more callbacks, with a t statistic of about four."
],
[
50.1,
"Because the names were assigned at random, this difference in means estimates the causal effect of the name."
],
[
57.2,
"The gender regression did the same arithmetic, but nobody assigned gender at random."
],
[
63.0,
"Men and women in the data also differ in their jobs, fields and hours."
],
[
68.2,
"There, the coefficient describes the gap."
],
[
70.9,
"It is not the effect of gender."
],
[
72.8,
"Run the cell to check the numbers."
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
"py-roadmap": [
[
0.2,
"We're going to cover several topics, starting with how to load data sets, which we have already discussed."
],
[
6.8,
"Then I'm going to show you two ways to run a simple OLS regression in Python."
],
[
11.9,
"I'm going to also show you how to get additional outputs in Python, just like Excel,"
],
[
16.7,
"and I'm going to do the same thing in two more example data sets, and also give you one code block with everything you need."
],
[
26.2,
"In the future, if you want to do a regression, you can just copy that code block and change something to your data set and your variables of interests."
],
[
36.6,
"And then I'm going to talk about how to do regression with dummy variables instead of continuous variables."
]
],
"py-load": [
[
0.2,
"So as usual, we are going to first need to import all the relevant packages. So we are going to use three packages for now,"
],
[
8.2,
"the pandas package, the numpy package, so those are the basic stats packages, and then we are going to also upload the statsmodels package."
],
[
18.0,
"We're going to first use a matrix method, so I'm going to import the statsmodels.api and call that thing the sm."
],
[
28.3,
"All right, so we have uploaded the packages, now we need to import the data set,"
],
[
33.5,
"okay. So the first data set I'm going to use is the housing price data set,"
],
[
39.5,
"and I have already uploaded the data set to my website. So what you could do is to just use this data set just to copy this URL link,"
],
[
50.5,
"and Python is going to read the data set from my website. You could also upload the data set from your local machine,"
],
[
57.7,
"which we have covered in the previous videos. So for now, I'm just going to upload the data set and call the data set house data."
],
[
68.5,
"And then I'm going to describe the data set and print the outcome. Let's see. So that's the housing price data set in Boston."
],
[
78.4,
"So we have 88 observations. And this basically summarizes the two variables in the data set,"
],
[
84.1,
"the square footage and the price. And here, where the price is in $1,000."
]
],
"py-matrix": [
[
0.2,
"Now, there are several ways to run the regressions. So first, recall what the basic regression model looks like when we have only one regressor,"
],
[
10.0,
"only one x variable. Left-hand side variable here is yi. Right-hand side variable is xi."
],
[
17.1,
"We have two parameters to estimate, the intercept, beta 0, and the slope, beta 1. and then there's some residual term."
],
[
26.3,
"So the goal of estimation is to recover the beta 0 and beta 1 from the data."
],
[
32.6,
"So how are we going to do that? The first way is to use something called the OLS functionality in the statsmodels,"
],
[
40.5,
"which uses the matrix notation, which is a little bit more complex but it may be useful for future classes so i think it's it's useful to cover that here"
],
[
52.8,
"so what i'm going to do here is to specify two variables basically two matrices the y matrix which is the left hand side variable the x matrix is the right hand side variable so i'm going to here so i'm going to assign the the data the price column of the data into the y variable the square footage column of the data into the x variable."
],
[
75.6,
"And I'm also going to use the add constant function to also add constant term into the x matrix."
],
[
84.0,
"So you can think about this beta 0 as beta 0 times a constant 1. In some sense,"
],
[
90.3,
"you could also interpret that constant 1 as a column in the matrix, so that's why we have to do it."
],
[
99.5,
"And then you can call the OLS function from the sm, the statsmodels."
],
[
105.6,
"So we have the left-hand side variable, the right-hand side variable, and use the fit function to fit the data."
],
[
112.0,
"And I'm going to call to assign the outcome to a variable named est. This is a standard way to name the regression outcome because est stands for the estimation,"
],
[
123.0,
"but you can use whatever names you like. And finally, I'm going to summarize this est variable and I'm going to print the outcome."
]
],
"py-read": [
[
0.2,
"So let's see what happens. Basically, we get a regression table that looks great. It reports all the relevant things we have talked about,"
],
[
9.9,
"the R squared, F statistics, and importantly, all the coefficients and the statistical inference related to those coefficients the constant term is beta zero square footage is beta one so we find the coefficient of square footage to be 0.14 interpretation is that if i increase the square feet of a house by one square feet right the price of that house is going to increase by 140 dollars it is 140 because the y variable the price is in thousand dollars so we have to scale this coefficient by 1,000 when we interpret the magnitude of this coefficient."
],
[
54.0,
"And similarly, we can do statistical inference. You can see the standard error is pretty low."
],
[
60.6,
"The t-statistic is high. The p-value is 0, right? And you also see that 0 is clearly outside this 95% confidence interval,"
],
[
70.3,
"right? You have pretty strong confidence that the square footage coefficient, the beta 1 coefficient is different from zero,"
],
[
78.6,
"right?"
]
],
"py-formula": [
[
0.2,
"Okay, so that's one way to do it. It's used as a matrix way, which is useful,"
],
[
6.9,
"but it's not the primary way we're going to do regression in this class. The more popular way is to import a formula,"
],
[
16.8,
"use the formula API. So we first import the statsmodels.formula.api and call that smf."
],
[
24.2,
"So it's sign statsmodels.formula, right? So formula basically uses the formula notation. So it works in a similar way as R."
],
[
34.1,
"So if you're familiar with R language, you'll find writing regression codes in formula easier than writing regression codes in matrix."
],
[
43.3,
"But the output is going to be exactly the same as the matrix version above."
],
[
49.9,
"Also, the computer is going to perform the exact same calculations as well. So it won't be the case that either method is going to be more computationally intensive or less so."
],
[
61.9,
"Again, this is going to be the method I'm going to use most frequently for the remainder of the class."
],
[
67.8,
"So here's how you're going to do it. And the formula for format looks like this."
],
[
72.6,
"If you have y on the left-hand side and x on the right-hand side."
],
[
75.7,
"It's sort of the more intuitive way to write down the regression."
],
[
82.2,
"So here, we call the smf and the OLS function. we just specify the formula, so y variable and x variable,"
],
[
89.8,
"and the data. The data here is the house data I just uploaded."
],
[
95.1,
"And again, I need to fit the function and I'm assigned, I'm going to assign the outcome to the est variable and then summarize and print it out."
],
[
105.1,
"You'll see the exact same table. So it just uses a different syntax, which is probably a more elegant syntax than the matrix syntax."
]
],
"py-more": [
[
0.2,
"Okay, one thing you might notice is that Python gives you less output than Excel. So actually,"
],
[
8.8,
"the Python does produce and store the relevant output, it's just that it's not going to give you by the summary command to have to use some other command to get those values."
],
[
20.0,
"So I'm going to show you how to get most of the other interesting values. The first thing I'm going to show you is ANOVA table."
],
[
27.8,
"It turns out you can just use the ANOVA function and call the est, that is the estimate,"
],
[
36.0,
"the variable we just store the regression outcome. And you can just print this ANOVA table."
],
[
44.5,
"And you see what ANOVA table tells you is essentially the sum of squared to residuals,"
],
[
51.5,
"it's the sum of square residuals for the residual and the sum of square explanatory variables,"
],
[
60.5,
"the square feet here. It also shows the degree of freedom, the relevant F statistics, and the p-value."
],
[
67.6,
"So it also does the F test for you."
],
[
72.5,
"To get the total sum of squares, you have to add the two things together."
],
[
78.9,
"Python still doesn't give you the total sum of squares, You know the total sum of squares in math,"
],
[
84.8,
"it just explains the sum of squares, this number, plus the sum of square residuals, this number."
],
[
91.7,
"So if you add them up, you're going to get the TSS, the total sum of squares."
],
[
96.9,
"So you can add them up by just calling the est.ess, which stores this number,"
],
[
103.4,
"and the est.ssr, which stores this number, and you're going to get the TSS."
],
[
110.2,
"Similarly, you can get the mean squared error, just like in Excel. It's just going to be the sum of squared residual divided by the degree of freedom."
],
[
122.3,
"So it's number of observations minus two, because you estimate two parameters. So you can get the MSE."
],
[
129.6,
"And finally, if you want to get the standard error of the regression, you know that's just the square root of MSE."
],
[
136.2,
"So you just use the numpy package to call the square root function and put the MSE we just get."
],
[
143.5,
"And you're going to get the SER, the standard error of the regression."
]
],
"py-diamonds": [
[
0.2,
"And this is how we do a regression analysis in Python. We can also use diamonds."
],
[
7.3,
"So let's try diamond data instead. So here I'm going to read the diamonds data from my website and see what the first four rows looks like,"
],
[
16.2,
"first five rows looks like. It shows the color, the carats, and the price. I'm just going to use the formula syntax and show report the regression results of the diamond prices on the diamond carats."
],
[
31.8,
"We use the same syntax we have shown you before."
],
[
37.3,
"Basically, you get this regression outcome. You have 380 observations, the r-square is pretty good,"
],
[
45.0,
"0.65. You see the intercept and the carats and the coefficient on carats. And the coefficient is pretty big,"
],
[
53.0,
"5,500, meaning if a diamond is one carat bigger, the price of the diamond will be about 5,500 more expensive."
]
],
"py-block": [
[
0.2,
"And finally, we can use the wine data. This time, I'm going to include everything in one block of code,"
],
[
6.9,
"which includes all the things we have done before, like importing the packages, load the data,"
],
[
12.5,
"and get the regression to run. In the future, you can just copy and paste this block into any Jupyter notebook you want to do,"
],
[
22.7,
"and modify this by changing the name of the data file and the change of the variables,"
],
[
28.1,
"and you could get the regression outcome for whatever setting you like. So it's a pretty useful block of code."
],
[
36.3,
"So I'm not going to explain each line. You can read those comments. Let me just hit this execution button,"
],
[
44.6,
"and you see the output. So this is a regression of wine prices on wine ratings."
],
[
50.1,
"You have 230 observations. R-square is about 0.35. So the data for the model explains a reasonable but not huge amount of the variation in the data."
],
[
63.4,
"Now the score coefficient is 1.49, and it's pretty significant. It's significantly different from zero,"
],
[
70.8,
"meaning if the score is one point higher,"
],
[
75.1,
"the price on average is going to be $1.5 more expensive."
]
],
"py-dummy": [
[
0.2,
"And lastly, I'm going to show you how to do the dummy regression in Python. It turns out the procedure is the same."
],
[
7.6,
"We just need to change the interpretation of things. So here I'm going to use a data set that is a CPS12 data set."
],
[
15.6,
"That's the current population survey conducted in 2012. First, let's see the first few rows of that CSV file."
],
[
24.8,
"You see the regression data set includes the gender, the male or female, two dummy variables,"
],
[
33.6,
"and the continuous variable earnings. So male takes the value of 0 or 1, male takes the value of 1,"
],
[
41.9,
"meaning that observation is a male, and female takes the value of 1, meaning the observation is a female."
],
[
48.8,
"Now we could do a regression of earnings on the male dummy, right? And what you'll see is a regression outcome."
],
[
57.7,
"You see we have about 4,000 observations. R squared is actually relatively low here, meaning the gender doesn't explain."
],
[
64.5,
"most of the variation in the data. However, we do find a pretty big and significant coefficient on male dummy."
],
[
74.8,
"So the coefficient is 3.8. Standard error is about 0.35, giving the t-statistics that's about 10."
],
[
83.9,
"The p-value is going to be 0. So we are pretty confident that this coefficient is different from 0."
],
[
90.2,
"Now, to interpret a coefficient on a dummy variable, we have to be careful, we have to think about what is the baseline group here."
],
[
98.7,
"The baseline group is a group that takes the value of zero on that male variable,"
],
[
104.8,
"that's a female group. So we basically have the female group as the baseline. Now to interpret this 3.79,"
],
[
112.7,
"we cannot say that the x variable increased by one unit, what would the y variable,"
],
[
118.8,
"the earnings change, which doesn't makes sense because dummy variable only takes several values. It's not a continuous variable,"
],
[
128.0,
"so you're not going to shift that value up and down. Rather, you would say this coefficient tells us the male earning is,"
],
[
136.4,
"on average, $3.8 higher than the female."
],
[
145.4,
"So that's a right interpretation."
]
],
"py-female": [
[
0.2,
"Now, it's also fine if we use the female dummy instead of the male dummy. So we just need to make sure we interpret things correctly."
],
[
7.9,
"Now, the intercept is the average of the male earnings."
],
[
12.8,
"And the sum of the two coefficients is going to be the average female earnings. So previously,"
],
[
17.7,
"here, I should have explained this, that the intercept is essentially the female average earnings. And the male coefficient is additional earning of male group than the female group."
],
[
30.0,
"Now, if we use a female dummy instead of a male dummy, the interpretation of the intercept and the slope is going to change."
],
[
37.9,
"But beta 1 is actually no longer the slope. But beta 1 is going to be the differences in earnings of a female compared with a male."
],
[
46.3,
"the conclusion is not going to change. So we can do the regression. You see now the intercept is going to be the average male earnings in the data."
],
[
54.5,
"The female dummy, the coefficient is going to be the exact negative value of the male dummy here."
],
[
60.9,
"Here we have positive 3.8, here we have negative 3.8. And the intercept is,"
],
[
67.9,
"again, it's going to be, the interpretation is going to be the average male earnings now if you see all the t values p statistic confidence intervals associated with the female dummy right it's going to be kind of uh the same in terms of the absolute value if you compare that with the male dummy that is just you get uh the negative uh 3.1 to negative 4.4 here exactly the opposite so again the economics meaning is going to be the same we have to change our interpretation so if we want to study the gender difference in earnings you could write either regression just to make sure you interpret the baseline group right and this is this dummy variable correctly and that'll be fine"
]
],
"py-numbers": [
[
0.0,
"The summary is for reading."
],
[
1.6,
"When you want to use a number, in a calculation or a report, pull it out of the results directly."
],
[
7.9,
"The table shows where each part of Excel's output lives in Python. params are the coefficients and bse their standard errors. tvalues and pvalues are the tests. conf_int gives the 95 percent confidence intervals. rsquared is the R squared and nobs the number of observations."
],
[
29.1,
"And predict applies the fitted line to new values of X."
],
[
32.9,
"Run the cell."
],
[
33.7,
"Then try one on your own."
],
[
35.9,
"The diamonds file has a dummy called color, equal to one for colorless or near-colorless stones."
],
[
42.7,
"Regress price on color, and say in words what the intercept and the coefficient mean."
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
"summary": [
[
0.0,
"Let's wrap up."
],
[
1.6,
"When X is binary, the intercept is the mean of the group with X equal to zero, the intercept plus the coefficient is the mean of the group with X equal to one, and the coefficient is their difference."
],
[
15.0,
"It is not a slope."
],
[
16.2,
"The t test on the coefficient is the difference in means test, with the same estimate and the same confidence interval."
],
[
24.2,
"Either coding of the dummy works, as long as you know which group is the baseline."
],
[
29.4,
"In an experiment, where the treatment is assigned at random, the coefficient on the treatment dummy estimates the causal effect; without random assignment, it describes a gap."
],
[
40.8,
"In Python, the matrix way and the formula way give the same regression."
],
[
45.9,
"The summary shows the main table; the rest of Excel's output, the sums of squares, the mean squared error and the standard error of the regression, are stored in the results and one line away."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook."
]
]
};
