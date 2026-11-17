// Transcripts of the voice-over: the recordings' own words (faster-whisper large-v3-turbo, word timestamps),
// written by ../../code/make_audio.py; the slides without a recording are read by a text-to-speech voice
// (../../code/make_tts.py) and carry their script, sentence by sentence. Times are seconds into each clip.
window.TRANSCRIPTS = {
"title": [
[
0.0,
"Hello."
],
[
0.4,
"In this module we use Python for three things: predictions and their intervals, regressions with more than one X, and tests of several coefficients at once."
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
"The module has three parts."
],
[
1.7,
"Part one is prediction: a point prediction, and the two intervals around it."
],
[
7.0,
"Part two is multiple regression in Python, with house prices and orange juice, and what happens when two X's carry the same information."
],
[
17.0,
"Part three is the F-test: how to test several coefficients at the same time."
],
[
22.2,
"The Python cells on the page load the three data files for you."
]
],
"pi-intro": [
[
0.2,
"So as always, we first need to import the relevant packages. We're going to use the all three packages,"
],
[
6.9,
"pandas, NumPy, and statsmodels.formula.api as the smf. First, let's load the housing data. So again,"
],
[
16.4,
"I load the house data from my website. First thing I'm going to do is to show you how to get prediction intervals in Python."
],
[
23.9,
"It turns out to be pretty easy. We first need to run the relevant regression and then we're going to specify the X values we are interested in."
],
[
33.3,
"We want to get predictions for and turns out Python has a a built-in get_prediction function that's exactly what we want."
]
],
"pi-byhand": [
[
0.2,
"So first, let's run the relevant regression using the statsmodels formula format."
],
[
7.0,
"We're going to get that regression outcome we have seen several times. Now, suppose we want to predict the price of a house of a given size."
],
[
16.5,
"To get a prediction, what we need to do is to plug in the relevant house size into the regression line formula."
],
[
23.8,
"For example, if we are interested in the value of the predicted value of the 2500 square feet house,"
],
[
31.7,
"we need to compute the intercept plus the square feet coefficient times 2500 and we get the prediction outcome."
],
[
41.4,
"You can do that exactly here using the math formula in Python."
]
],
"pi-getpred": [
[
0.2,
"Actually, could automate this in Python. What we need to do is to first tell Python what house sizes we are interested in getting predictions and prediction intervals for."
],
[
10.1,
"We're going to pick several house sizes to evaluate. We're first going to define a dictionary,"
],
[
16.5,
"d, basically square feet in several points of interest. We're interested in houses of size 1500 all the way to 4,000."
],
[
25.8,
"Now we can define the data frame basically converts that dictionary to a data frame and we run the code you're going to get the data frame a table like this now how do we do the predictions we just use the recall the function called the function est where we just estimate the the ols regression right we use the get prediction function and we need to evaluate the get prediction function at data frame at the points we just defined,"
],
[
54.9,
"those are the six points we're interested in. And then we're going to specify, we want to make predictions at 95% confidence interval,"
],
[
63.3,
"so the alpha level is going to be equal to 1 minus 95%, it's 0.05."
],
[
69.1,
"I'm going to summarize the frame and let's see what we get."
]
],
"pi-read": [
[
0.2,
"So Python is going to give us the mean prediction, so that is the point prediction."
],
[
8.1,
"It's also going to give us the standard error associated with the mean, the mean, the confidence interval,"
],
[
16.0,
"and obs_ci, which is the prediction interval. So the difference between the confidence interval and the prediction interval we have explained before,"
],
[
28.1,
"the confidence interval is telling us how precise our mean estimate is."
],
[
34.0,
"It's a property to the mean estimator. The prediction interval, on the other hand, is to describe the underlying population,"
],
[
43.3,
"is to show what's the variation in the underlying population. So therefore, the prediction interval is going to be much wider than the confidence interval."
],
[
52.5,
"And that is going to hold for any value, mean value you're interested in. You always find a wider prediction interval than a confidence interval."
]
],
"pi-robust": [
[
0.2,
"and lastly we could also use the robust standard errors in the prediction intervals so sort of combine what we have talked before right so this time we're going to use est_r to get the prediction instead of the est so i'm using the regression i just get here"
],
[
16.1,
"Despite the mean estimate, it's the same because the heteroskedasticity and homoskedasticity assumption wouldn't matter the point estimates on coefficient."
],
[
26.6,
"Now, the mean squared error is going to be bigger, meaning a wider confidence interval and also a slightly wider prediction interval."
],
[
34.0,
"At the prediction interval, the variance is still largely come from the underlying variation in the data."
],
[
39.5,
"So it's going to be wider. It's not going to be substantially wider."
]
],
"pi-bigger": [
[
0.2,
"And finally, since we're already in Python, let's do a quick illustration of how prediction intervals change as sample size increases."
],
[
9.9,
"So we had previously talked about confidence intervals going to get more and more precise, basically smaller and smaller when we increase our sample size."
],
[
18.5,
"But the prediction intervals won't, because prediction intervals talk about the underlying variation in the population which wouldn't change if we change our sample size but here i'm going to do is in a lazy way to pretend we have a larger house size but just replicating the same data set 100 times which give us 8800 observations instead of 88 observations it's a lazy way you should never do this in real life You can think about this as something to have like each house actually represent 100 houses exactly like it."
],
[
53.8,
"In reality, the truly data set, large data set, would clearly have more variation in both sizes and price."
],
[
60.9,
"So but for now, let's just give a sense how sample size change would make confidence interval or prediction interval change."
]
],
"pi-bigger2": [
[
0.2,
"So here in the code, I define the house data bigger by just replicating the house data 100 times."
],
[
7.1,
"And then run the regression on this new data set, house data bigger. Here's the output you get."
],
[
12.8,
"To see the point estimate is exactly the same. The standard error is now much smaller."
],
[
19.4,
"And we can repeat the exercise before by doing the confidence interval and the prediction interval."
],
[
24.9,
"So now you see a much, much smaller confidence interval. that they are very, very closely around the mean,"
],
[
36.2,
"they don't see much change in the prediction interval. And again, the reason is the confidence interval is going to get smaller as our estimate gets precise,"
],
[
45.7,
"more and more precise. The prediction interval won't, because prediction interval captures underlying variation in the population,"
],
[
52.7,
"which wouldn't depend on our sample size."
]
],
"pi-try": [
[
0.0,
"Here are both intervals as bands around the regression line."
],
[
3.8,
"The narrow band is the confidence interval for the average house of each size."
],
[
9.2,
"The wide band is the prediction interval for one house."
],
[
12.6,
"Move the slider to pick a house size, and read the two intervals below the chart."
],
[
18.0,
"Both are narrowest near the average size, about two thousand square feet, and widen as you move away."
],
[
25.0,
"Now multiply the sample: let each house stand for four, twenty-five, or one hundred houses."
],
[
31.4,
"The narrow band collapses onto the line."
],
[
34.1,
"The wide band stays where it is."
],
[
36.8,
"More data tells you more about the average."
],
[
39.5,
"It does not make individual houses more alike."
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
"mr-formula": [
[
0.2,
"In this notebook, we're going to discuss multiple variable regression. We're going to cover the multiple regression,"
],
[
6.8,
"robust standard errors, and prediction intervals for the multiple regression. We're going to talk about several examples,"
],
[
12.8,
"like the orange juice example. We're going to show you then some collinearity issue, like this perfect and near perfect."
],
[
21.1,
"Now, the first thing we're always going to do is to load packages. We're going to use the three very familiar packages,"
],
[
28.1,
"the pandas, numpy, and statsmodels.formula.api, the SMF. So we have already imported those packages."
],
[
36.9,
"First, let's load the house data. Now, this is the house data with multi-variables. We have price,"
],
[
42.4,
"square feet, lot size, and number of bedrooms. So the first thing we're going to do is to show how to do multi-regression using Python with a lot of X's."
],
[
52.6,
"It turns out the formula is pretty simple. We just have more X's on the right-hand side,"
],
[
58.8,
"and we use the plus sign to connect all those X variables. So remember the variable names are square feet,"
],
[
65.7,
"lot size, and bedrooms. We have the square foot plus lot size plus bedrooms here in the regression formula."
],
[
72.4,
"The data is again the house data. We ask Python to fit the data and print out the summary of the regression outcomes."
],
[
79.5,
"We have this very nice table, right? So again, we could see all the coefficients and what's not."
]
],
"mr-bdrms": [
[
0.2,
"And one thing you might notice is that the bedroom is going to have a pretty big standard error and a small t-stat,"
],
[
7.5,
"meaning it's not going to be significant at 10% level, which is a little bit counterintuitive because we think the more bedrooms should explain higher prices."
],
[
18.2,
"So it turns out one of the reasons why we have insignificant coefficient on bedrooms is likely due to very limited variations in number of bedrooms."
],
[
27.4,
"We can evaluate that, verify that by plotting the distribution of the histogram of the bedroom variable,"
],
[
34.1,
"which you can see very clearly in the data, we observe most houses, like 70%, 80% of houses have either three or four bedrooms,"
],
[
41.6,
"which is true. But we have pretty limited variations in number of bedrooms, which partially explain why we have a relatively big coefficient,"
],
[
50.2,
"but pretty insignificant coefficient."
]
],
"mr-pred": [
[
0.2,
"Now, we can easily compute the heteroskedasticity robust standard errors if we want in a multiple regression."
],
[
6.7,
"The way to do it is just now, when fit, we specify the covariance type equal to hc1."
],
[
12.5,
"So it's exactly the same as in the single variable regression. And again, we can run the regression and report the results with a robust standard error."
],
[
23.2,
"So you see the standard error is going to get inflated a little bit because now we are reporting the robust version."
],
[
29.4,
"Now the prediction and confidence intervals are going to work just like before. Now the big difference is that we have to specify values of more than one X."
],
[
38.7,
"Previously, we just specified different square foot. Now we have to specify the combination of square foot,"
],
[
45.1,
"lot size, and bedrooms. For example, if we construct a table like this, we have two houses we want to predict their value."
],
[
53.2,
"House one with 2,000 square feet, 4,000 lot size, and three bedrooms. House two with 3,000 square feet,"
],
[
59.3,
"5,000 lot size, and four bedrooms. We can create this data frame, and again, we use the estimates using the get_prediction function apply that function on the data frame we just created,"
],
[
71.6,
"we're going to get the predictions. And we can summarize the predictions at 0.05 level to get the 95% confidence interval and prediction interval."
],
[
82.4,
"And you see we get this Python is going to give us the confidence interval as well as the prediction interval."
]
],
"oj-data": [
[
0.2,
"Okay, now let's switch gear to a new example, the orange juice demand. So to make this interpretation easier,"
],
[
7.3,
"I'm going to convert the quantities to thousands of 64-ounce containers sold. So basically, we're going to divide the original quantity by 1,000 and then dividing the result by 64."
],
[
19.1,
"So I'm also going to do some other conversions by multiplying the price by 64. So now the price is going to the price for 64-ounce container."
],
[
30.5,
"Now, they are not going to change any substantial conclusions, but they make the interpretation slightly different."
],
[
36.4,
"Now, let's first load the data and take a look at the first few observations of the data set."
],
[
42.0,
"That's a quantity, the price of the brand one. Also, we have two competing brands, brand two and brand three."
],
[
48.9,
"And in the data set, we also have the prices for both competing brands."
]
],
"oj-reg": [
[
0.2,
"Now, we can first do a simple regression of the first product on its own price,"
],
[
5.4,
"right? So it's a single variable regression with the dependent variable being Q1 and the regressor being P1."
],
[
13.2,
"And we can fit the model and print the results. As you see, the P1, the coefficient is minus 80."
],
[
20.2,
"Now, what we could do is to add prices of two other brands, P2 and P3,"
],
[
25.0,
"into a regression and see the regression outcome of that multivariate regression. And you see P2 and P3 both have a positive coefficient."
],
[
33.7,
"And P1 now has a negative coefficient, but it's even more negative. Previously it's minus 80,"
],
[
41.5,
"now it's becoming minus 85."
],
[
45.0,
"Now, sort of how to interpret that? It tells us the quantity, my quantity, is going to decrease as I increase my price."
],
[
53.2,
"But my rival's price, when my rival increases their prices, my quantity actually is going to increase because some of the consumers are going to shift to my brand right so there's some market competition going on here"
]
],
"oj-ovb": [
[
0.1,
"now what's also interesting is that if you include both rival prices p2 and p3 you see the p1 gets more negative right so what does this tells us this tells us perhaps p1 p2 and p3 has some positive correlation and it seems that by omitting the P2 and P3,"
],
[
20.8,
"those two variables, we are going to get the P1 estimates closer to zero."
],
[
28.3,
"Which means P2 and P1 and P3 is likely to have a positive correlation. And you can verify that claim by reporting the correlation of those three variables."
],
[
37.7,
"And you can see the covariance matrix, you see the covariance between P1, P2, P1, P3,"
],
[
43.9,
"and P2, P3, they're all positive. But that verify our hypothesis, the prices tend to shift in the same direction."
],
[
50.6,
"When my price is high, my rival prices tend to be high as well. This is because some sales event is likely to occur at the same time,"
],
[
58.9,
"which makes our prices tend to move in the same direction. And then if the price is moving in the same direction and my rival price actually is going to increase my demand,"
],
[
70.7,
"then failing to incorporate my rival price, we are going to underestimate the effect of my own price on my quantity."
],
[
77.5,
"That's why we get minus 80 instead of minus 85 here. Again, that is related to the omitted variable bias."
],
[
84.4,
"And it's consistent with the discussion."
]
],
"pc-perfect": [
[
0.2,
"For the rest of this video, I'm going to discuss the collinearity issue. So now, first,"
],
[
7.6,
"let's recall the simple house example where we only have one regressor square foot. We can print the regression outcome,"
],
[
14.7,
"and it looks all right. Now, what if we also include house size in square meters?"
],
[
20.6,
"No, the square meters are simply square feet divided by 10.764. So there is a mathematical relationship to convert the square meters to square feet."
],
[
31.4,
"So in other words, those two things are perfectly correlated. So we would have a perfect collinearity issue if we include both square feet and square meters at the same time."
],
[
42.5,
"First, we can verify they are perfectly correlated by reporting the correlation table. And you see the off-diagonal terms are equal to 1,"
],
[
50.2,
"so that means they are exactly perfectly correlated."
]
],
"pc-perfect2": [
[
0.2,
"Now let's see what would happen if we run the regression with both. So we know it's going to be problematic if we have both square feet and the square meters."
],
[
15.2,
"And that issue is clearly seen here. you see that the regression outcomes is going to be problematic in this."
],
[
24.1,
"And they're going to report the two coefficients separately, but you can clearly see they're going to have the same t value."
],
[
30.0,
"So it sort of indicates that describing the same thing. Now, in the table notes, Python tells us or warns us that the smallest eigenvalue is very,"
],
[
39.3,
"very small. So this might indicate there are strong multicollinearity problems or the design matrix is singular."
],
[
45.9,
"But again, here you should be worried. You shouldn't interpret that as the true effect. So if you compare that with a square foot,"
],
[
54.3,
"you can see this is not going to be exactly the same and you should be careful when interpreting the results."
],
[
62.2,
"When you see the table notes like this, you should understand that the regression is problematic."
]
],
"pc-drop": [
[
0.2,
"OK, now the solution is going to just drop one of them. So either we just have the square feet or we just have square meters."
],
[
6.4,
"And if we just have square feet, you're going to get a fine outcome. And in other words,"
],
[
11.7,
"if you just add the square meters, square meters is sqrmt, right, and the random regression,"
],
[
17.7,
"you're also going to get a pretty fine outcome. But adding both, so states that Python is going to sort of report a mix of both by trying to address this issue again it's problematic because of the warning sign so you should pay attention to that"
]
],
"pc-near": [
[
0.2,
"now in one other case we might have a near-perfect collinearity example right if we load the suv data where we report the model prices and so on and so forth that if you just want to include the invoice and the msrps remember those are two different prices invoice price is close to the retail price of the car msrp is sort of the manufacturer specified price car if we add both invoice price and msrp price right it's going to get a regression outcome that looks like this right you have both coefficients that's not significant and you have t value that is pretty small and the p value of both greater than 0.1 and the coefficient has a negative sign on invoice price but a positive sign on the msrp price right so python also tells you that the condition number is pretty large so that indicates there are strong multicollinearity issues right so uh sort of python tells us there's some problem in our X's right"
]
],
"pc-near2": [
[
0.0,
"if we show the correlation between the invoice price and the msrp price the correlation is 0.998 so it's pretty high correlation right so in this case we also want to drop one of the variables."
],
[
11.8,
"So what we're going to do here is to just regress the share on MSRP and drop the invoice."
],
[
18.5,
"Right here, you get a negative coefficient on MSRP. It's going to be significant and it's also intuitive because higher price tends to indicate lower sales."
],
[
30.5,
"So let's say that basically tells us when we have strong multicollinearity issue, we should also drop one of the variables."
],
[
41.4,
"Now the result is going to make a lot more sense. So you can see clearly from this regression table."
]
],
"pc-try": [
[
0.0,
"Here is collinearity in a simulation where we know the truth: both X's have an effect of exactly one."
],
[
6.8,
"The slider sets how strongly the two X's are correlated."
],
[
11.0,
"Start with a correlation of zero and draw two hundred samples."
],
[
15.1,
"Each dot on the right is one sample's pair of estimates."
],
[
18.8,
"The cloud is round and tight around the truth."
],
[
22.3,
"Now move the correlation to 0.99."
],
[
24.9,
"The cloud stretches into a long, thin line."
],
[
28.2,
"Each coefficient alone is very imprecise, and can even have the wrong sign."
],
[
34.5,
"But along the line, the sum of the two is still close to two."
],
[
38.4,
"The data know the combined effect."
],
[
40.6,
"They cannot say which X deserves the credit."
],
[
43.9,
"That is why the two t-tests often find nothing, while the joint test, in the last line, still finds a clear effect."
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
"f-why": [
[
0.2,
"This week's online content, we're going to discuss the F-test, basically, how to test joint hypothesis in a linear regression framework."
],
[
12.2,
"So first, the idea is that in multi-variable regressions, now we have more than one covariate,"
],
[
18.8,
"we sometimes want to test hypotheses that's related to more than one coefficient at a time."
],
[
24.6,
"For example, one of the questions we might be interested in is that, could all of the X in our regressions be useless?"
],
[
32.0,
"The F-statistics automatically report Excel, R, and Python output can be used to conduct a test of those joint hypotheses."
],
[
41.8,
"The general method for testing such hypotheses is called an F-test, and that is built on the F-statistic material we saw earlier."
],
[
50.4,
"Now, F-test can test what we call the multiple restrictions for a more general or unrestricted model."
],
[
58.0,
"For example, if we run a regression on 10 different variables, 10 X's, and we wonder what we can do if we just have four X's,"
],
[
67.6,
"like whether those additional six X's help us to achieve a better model fit or improve the model fit substantially,"
],
[
75.3,
"we could do an F test to jointly test whether the 10 minus 4, those other six X's are useful."
],
[
83.1,
"Alternatively, you might wonder what two coefficients are exactly equal to each other. If we want to test the coefficients of one variable is the same or different from the coefficient of another variable,"
],
[
94.6,
"we could also do so using an F-test."
]
],
"f-idea": [
[
0.2,
"So to fix ideas, now let's start with a regression with three different regressors. So the right-hand side can have three variables,"
],
[
8.8,
"x1, x2, and x3. We may want to test a hypothesis that's pretty interesting, that is the beta 2 equal to beta 3 equal to 0."
],
[
18.4,
"So we want to jointly test whether both beta 2 and beta 3 are equal to 0."
],
[
23.5,
"Now the alternative hypothesis is going to be the beta 2 not equal to 0 or beta 3 not equal to 0."
],
[
30.3,
"Now the relevant null hypothesis is true, right? So it's basically telling us if the null hypothesis is true,"
],
[
38.1,
"it tells us the model with just x1 is going to be just as good as the model with both x1,"
],
[
44.6,
"x2, and x3. So the idea here is to compare r's because we know r, R squared,"
],
[
50.9,
"is a way to describe the model fit. So the idea here is that if we enforce H zero to hold,"
],
[
57.8,
"the null hypothesis to hold, you can see how much the R squared is going to fall."
],
[
62.2,
"If the R squared falls a lot, then the null should be rejected because that tells us having those two additional variables x2 and x3 is going to explain a big share of the data then we should reject them now if the R squared doesn't change much then probably beta 2 and beta 3 doesn't matter so it's probably equal to zero so we probably wouldn't be able to reject the hypothesis now the f test basically give us the criteria whether we should reject the null hypothesis or not."
]
],
"f-unrestricted": [
[
0.2,
"How does this exactly work? We're going to show you two ways to do the F-test."
],
[
5.3,
"The first is to do the F-test by hand using the formula. The second way is to show how to use Python codes to do the F-test automatically for you."
],
[
15.0,
"Now, we assume the OLS 1 to 5, all of those things hold. Actually, we do need homoskedasticity here to do the F-test."
],
[
23.4,
"Now suppose the full model we are estimating is given by this pretty general term, which we have p variables."
],
[
30.3,
"So this is called the unrestricted model. It's unrestricted because we are estimating all the coefficients beta 0,"
],
[
37.3,
"beta 1 to beta p without imposing any restrictions on the coefficients yet. Now we can calculate the R squared of this model."
],
[
45.6,
"We call it R squared U. So u denotes It's unrestricted, that is the R squared of an unrestricted model."
]
],
"f-restricted": [
[
0.2,
"The second step is going to ask, how much worse do we fit the data if we force the null hypothesis to hold?"
],
[
7.5,
"Now, let's see an example. We can have a null hypothesis that's pretty fancy. For example,"
],
[
13.2,
"here we have a null hypothesis that beta is 1 equal to 0, beta 2 equals 0,"
],
[
17.5,
"and beta 3 equals to beta 4. So the null hypothesis is going to be one of those things is not true."
],
[
23.8,
"Now, the restricted model is basically putting the null hypothesis, that restriction, into our regression model."
],
[
31.2,
"So basically, what the regression would look like if the null hypothesis is true. If the null hypothesis is true,"
],
[
37.7,
"then beta 1 takes the value of 0, beta 2 takes the value of 0. So we won't have the beta 1 x1i,"
],
[
44.3,
"and we won't have beta 2 x2i. We get rid of those two terms. We additionally assume beta 3 equal to beta 4."
],
[
51.0,
"So instead of estimating a beta 3 for the beta 3i, x3i, and beta 4 for x4i,"
],
[
57.6,
"now we can combine those two terms to collect them together and just estimate a single beta 3."
],
[
64.0,
"So in that sense, we actually have one, two, three, three different restrictions. To figure out how many restrictions we have,"
],
[
72.2,
"the easiest way is just to count how many equal signs we have. In the null hypothesis,"
],
[
76.7,
"we have three equal signs, so we just get three restrictions."
]
],
"f-r2": [
[
0.2,
"okay now since we have forced H zero to hold right we can just estimate this equation by OLS and calculate its R squared right we call that the R squared R so here the subscript r denotes the restricted model so it's the R squared associated with this restricted model now we know the R squared U is for sure going to be bigger than or equal to the R squared R the reason is that because we now have a more flexible model in the unrestricted model."
],
[
30.7,
"So the worst case that can do is that all the betas really take the null hypothesis in value."
],
[
37.2,
"Then the unrestricted model is going to do as well as the restricted model. If the true estimate in the unrestricted model differs from the null hypothesis,"
],
[
47.7,
"then the unrestricted model is going to work better."
],
[
51.8,
"So in some sense, mechanically, the unrestricted model is going to work better than the restricted model so if we want to reject the null hypothesis we need this this difference to be substantially large"
]
],
"f-formula": [
[
0.1,
"okay so it turns out we can construct the F statistics to show whether the difference is substantially large or not so the F statistics is going to be this right so the numerator is going to be the difference between the R squared in the unrestricted model and the restricted model then divided by q remember q is the number of restrictions we have under the null So in the previous example,"
],
[
24.6,
"we have three restrictions, so Q is going to equal to 3."
],
[
28.2,
"Now the denominator is going to be 1 minus R squared of the unrestricted model divided by the number of observations we have minus the variables minus 1."
],
[
38.5,
"So this is essentially the effective sample size. So once we write down, we construct that F statistics,"
],
[
45.2,
"it actually can be shown that the F statistics is going to follow the so-called F distribution."
],
[
50.5,
"Now, F distribution is governed by two things, both the number of restrictions, Q, and the effective sample size,"
],
[
58.3,
"n minus p minus 1."
],
[
60.2,
"So this F statistic is going to be very close to zero if the null is valid."
],
[
65.8,
"If the null is valid, these two things is going to be very close to zero."
],
[
70.6,
"So as a whole, the F stat is also going to be close to zero. On the other hand,"
],
[
75.9,
"if this whole thing is not close to zero, then we probably should reject the null hypothesis."
],
[
82.2,
"Now, we can actually calculate the p-value if we construct the f-statistics. It's just going to be the f-distribution."
],
[
89.6,
"We use an Excel command, it's going to be the f-distribution, and we can specify those two parameters that governs the f-distribution,"
],
[
96.7,
"the number of restrictions and effective sample size."
]
],
"f-overall": [
[
0.2,
"This example is related to a f-test that all the coefficients beta 1, beta 2,"
],
[
5.7,
"beta 3 equal to 0. So it's kind of one extreme of the f-test because the null hypothesis,"
],
[
12.5,
"if the null hypothesis holds in this particular case, all the three variables is going to be dropped from the model."
],
[
21.5,
"So under the null hypothesis restriction, we're going to have a regression that's going to have R squared under the restricted model going to equal to 0."
],
[
30.5,
"So the restricted model basically is telling us drop all the variables. It's basically not running a regression,"
],
[
36.4,
"which will yield a R squared R equal to 0. Now the R squared U here is going to be given by the R squared of the unrestricted regression."
],
[
45.9,
"So we plug in the 0.672 here, the 0 here, and also the 0.672 here."
],
[
54.2,
"Now, we also need to figure out the value of q at the effective sample size."
],
[
57.9,
"We have three restrictions. We have three equal signs here. So this is three. The effective sample size is given by this df residuals,"
],
[
66.7,
"essentially the degree of freedom in our model, which is 84. If you plug everything in,"
],
[
72.1,
"you get the f value. And you can also get the p value associated with the f value."
],
[
77.2,
"So you basically guess a f. This is so small, and we are pretty sure that it cannot be the case that all the three coefficients equal to 0."
],
[
86.0,
"So the main trick here is to realize that the regression with no X is going to produce R squared equal to 0."
],
[
92.5,
"So this is why we have the R squared R equal to 0 here."
]
],
"f-two": [
[
0.2,
"Now, if we want to do a more difficult test, if we want to test if beta 2 equal to beta 3 equal to 0,"
],
[
7.3,
"now we actually need to run a restricted regression. Because under the null hypothesis, we still have beta 1 left."
],
[
13.7,
"So beta 1 is the coefficient associated with the variable square foot. So we have to run this restricted regression and get the restricted R squared,"
],
[
24.7,
"which is given by this number, 0.621. Now, again, you plug in the F statistics."
],
[
30.3,
"You have the R squared U here equal to 0.672."
],
[
35.8,
"R squared R equal to 0.621. You plug everything in. You calculate the F statistics, which is 6.61."
],
[
44.0,
"Again, you can compute the associated FP value, which is 0.002, which is, again, a pretty small p value,"
],
[
51.3,
"meaning we are confident to reject the null hypothesis is that beta 2 equal to beta 3 equal to 0 at a 99% confidence interval,"
],
[
58.9,
"which is it basically tells us we are pretty confident in rejecting now again that beta 2 and beta 3 shouldn't equal to 0."
]
],
"f-python": [
[
0.2,
"So that's how we do it by hand, basically really running those two regressions. Fortunately, there is a simple way to compute an F-statistic in Python that doesn't require you to actually run the regressions twice."
],
[
12.3,
"Right. So once we run the full model, the unrestricted model, and if we save the output,"
],
[
18.1,
"and if we call the output modelUR, our unrestricted model, you can just use the f_test function."
],
[
25.6,
"Right. So modelUR, what you're going to do is to use the F test with modelUR.f_test,"
],
[
32.9,
"and you're going to impose two restrictions. The restriction is the lot size coefficient equal to zero and the number of bedrooms goes to zero and then you're going to the python is going to return the f test value for you so they have the f statistics associated p value the degree of freedom the number of restrictions and you can evaluate you can verify right that what python gives you is exactly the same as what you would have computed yourself"
],
[
60.5,
"right so in this sense we uh we just can say the p is so small so we probably would reject the hypothesis at the 99% confidence level, or the 1% significance level."
]
],
"f-try": [
[
0.0,
"Try the F-test yourself, with the house regression."
],
[
3.4,
"Tick the coefficients that the null hypothesis sets to zero."
],
[
7.9,
"The page runs the restricted regression, and shows the two R squareds, the F-statistic and its p-value."
],
[
15.4,
"The curve is the F distribution that the statistic follows if the null is true."
],
[
20.6,
"The shaded area to the right of the statistic is the p-value."
],
[
25.0,
"Start with bedrooms alone: F is 2.4, and the p-value is 0.13, the same as the t-test in the regression table."
],
[
36.1,
"Add lot size: the R squared falls from 0.672 to 0.621, and F is 6.6."
],
[
43.5,
"Tick all three, and you get the 57 of the regression output, far off the chart."
]
],
"f-oj": [
[
0.2,
"Okay, so let's see a different context and see how to do F-tests in a different context."
],
[
5.4,
"So now we are going to use the orange juice data. So we model the demand for Tropicana,"
],
[
11.0,
"one of the brands in the orange juice, as a function of the price of its own price and its rival's price,"
],
[
18.5,
"the Minute Maid price and a supermarket private label price."
],
[
24.3,
"So we want to learn what would happen if a price increased in either Minute Maid price or private label price."
],
[
30.7,
"How would that affect the quantity sold for Tropicana?"
],
[
36.9,
"So basically, you want to learn whether there's a business competition effect on prices of my rival brands on my own quantity."
],
[
44.6,
"So that's the point. like we probably want to test one thing that is whether beta 2 or beta 3 equal to zero."
],
[
51.9,
"Now, another thing we might want to test is whether beta 2 equal to beta 3."
],
[
55.8,
"So that says whether the price increase by the Minute Maid versus a private brand, are they going to have the same effect on the quantity of my brand?"
],
[
66.9,
"So we are basically testing whether those two things, those two brands, the same type of competitor or whether one of them is a stronger competitor."
],
[
77.0,
"So that might affect Tropicana's pricing strategy. So we want to figure out who is the main competitor in the market."
]
],
"f-oj-hand": [
[
0.2,
"So what are we going to do? First, we can do it by hand by first running the unrestricted model where we put the price of all three brands together."
],
[
8.3,
"We get the unrestricted R squared."
],
[
12.0,
"right so now we have to write down the restricted version now the restricted version is beta 2 equal to beta 3 so if beta 2 equals to beta 3 we can basically write the beta 3 into beta 2 and now you see we have beta 2 here and here so we can collect those two beta 2 together and construct a new variable the variable is going to be p2i plus p3i right so the two variables are going to share the same coefficient beta 2."
],
[
39.8,
"Now, the restricted model is going to be a regression"
],
[
43.5,
"on only two regressors, p1. The second regressor is p2 plus p3."
],
[
49.4,
"So this is going to be our restricted model. So we're going to construct a new variable that is p2i plus p3i."
],
[
56.5,
"We have to do that in Python. And then we are able to run a regression of two regressors,"
],
[
62.6,
"p1 and p2 plus p3."
],
[
65.1,
"And you get, again, the R squared. Again, this is the R squared of this restricted model."
],
[
72.2,
"And then you can get the R squared U and R squared R, and plug that into the f_test function."
],
[
80.2,
"You get the f value, which is 0.148."
],
[
84.0,
"Actually, we have a pretty small f this time. And if we calculate the p value,"
],
[
88.4,
"it's going to be 0.7. Given this large p value, we actually cannot reject the hypothesis basically under any significance level."
]
],
"f-oj-python": [
[
0.2,
"So I mean, in some sense, you can do it this way. But again, it's pretty complicated."
],
[
5.1,
"It requires you to basically rewrite the regression and even create a new variable. This is not trivial to do."
],
[
12.0,
"Now, fortunately, these calculations are very easy to do in Python, again. So what we need to do is first estimate the full model,"
],
[
19.9,
"modelUR. UR here is, again, unrestricted, not University of Rochester, so you can assign that to modelUR and use modelUR's f_test function to test here whether p2 minus p3 equal to 0."
],
[
36.1,
"So you can actually directly write that null hypothesis you want to test into this function."
],
[
43.6,
"So basically Python is going to return the f-test value, the p-value, and the number of restrictions,"
],
[
53.1,
"effective sample size back to you, and you can make your judgment after seeing the p-value."
],
[
57.7,
"Clearly, here we wouldn't be able to reject the null hypothesis. And again, you can verify the answer given by Python is going to match what we computed by hand."
]
],
"check-3": [
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
1.0,
"For a prediction, call get prediction."
],
[
3.7,
"Mean C I is the confidence interval for the average."
],
[
7.3,
"Obs C I is the prediction interval for one case."
],
[
11.2,
"It is always wider, and it does not shrink with more data."
],
[
15.2,
"For a multiple regression, add the X's with a plus sign."
],
[
19.1,
"Each coefficient holds the other X's fixed."
],
[
22.6,
"If two X's carry almost the same information, you see odd signs, large standard errors, and a warning under the table."
],
[
30.6,
"Check the correlation and keep one of them."
],
[
33.9,
"To test several coefficients at once, use f test."
],
[
37.4,
"By hand, compare the R squared of the unrestricted and the restricted model."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook."
]
]
};
