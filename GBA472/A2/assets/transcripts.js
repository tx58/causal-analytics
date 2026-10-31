// Transcripts of the voice-over: the recordings' own words (faster-whisper large-v3-turbo, word timestamps),
// written by ../../code/make_audio.py; the slides without a recording are read by a text-to-speech voice
// (../../code/make_tts.py) and carry their script, sentence by sentence. Times are seconds into each clip.
window.TRANSCRIPTS = {
"title": [
[
0.2,
"Today's agenda is to first have a very quick review of the pivot tables, which is a very powerful way to show the relationship between two variables."
],
[
9.7,
"actually a very super flexible way to link the relationship between two variables. And then we're going to talk about one of the most important methods in this class,"
],
[
20.5,
"which is the linear regression. We're going to give you some self-speech on why we're going to do the linear regression and why we're going to make this assumption,"
],
[
29.2,
"the linear assumption. And today we're going to learn how to do it using three different ways."
],
[
35.3,
"I'm going to talk about how to do the linear regression using Excel. I'm also going to show you how to do it using the Python and eventually ChatGPT."
],
[
46.6,
"And the important goal is to interpret the regression output. If I show you a regression table,"
],
[
52.7,
"you should be able to interpret the numbers in the table, what I learned from running a regression or getting those different estimates."
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
"Whatever the question, the first steps with a data set are the same."
],
[
4.2,
"You look at one variable at a time, you compare groups, and you fit a line."
],
[
9.2,
"Part one is about describing single variables: summary statistics and histograms."
],
[
14.8,
"Part two puts two variables together, with scatter plots and the correlation."
],
[
20.6,
"Part three is about crosstabs, or PivotTables, which compute conditional means for categorical data."
],
[
28.0,
"Part four runs a regression, four ways in Excel and then in Python, and shows you where to find the intercept and the slope in the output."
],
[
37.4,
"Three small data sets carry the whole module: 380 diamonds, the people on board the Titanic, and 6,050 workers from a labor survey."
],
[
49.0,
"You can download them here and follow along in Excel or Colab."
]
],
"data-kinds": [
[
0.0,
"Before computing anything, look at the first rows of the file and ask what kind of variables you have."
],
[
6.8,
"The diamonds file has two numeric variables, carats and price, and a binary one, color."
],
[
13.1,
"The Titanic file has no numbers at all: class, age, gender and survival are all categories."
],
[
20.1,
"The labor survey has both kinds: earnings, hours and years of education are numeric, gender and race are categories."
],
[
28.4,
"The kind of variable decides the tool."
],
[
31.6,
"Numeric variables get means, standard deviations, histograms, and, in pairs, scatter plots and correlations."
],
[
39.9,
"Categorical variables get counts and shares, and crosstabs when you want to compare groups."
],
[
46.1,
"And a numeric outcome compared across categories, like mean earnings by gender, is a crosstab as well."
],
[
53.0,
"That is Part three."
]
],
"summary-stats": [
[
0.2,
"In the workplace, sometimes you want to communicate information about a random variable to your colleague."
],
[
6.7,
"You probably don't want to send out the full distribution of a random variable, which is useful,"
],
[
12.4,
"but it's not easy to read immediately. Sometimes we might prefer to present a single number or summary statistic."
],
[
21.6,
"that gives the people an idea of what to expect without having to consider the full distribution of outcomes as we want some measures that characterize some pattern of a distribution without conveying all the information about the distribution those are the measures of central tendency with like uh uh things like mean"
],
[
45.1,
"the median and mode, with other ways, summarizes what the distribution looks like, especially at the center tendency,"
],
[
53.3,
"what on average what the distribution looks like. We might also want to give people an idea of how spread out the distribution is."
],
[
61.1,
"So that's captured by variance or standard deviation, also learned from the graphics class. So if a distribution has a low variance,"
],
[
70.2,
"the distribution, the pdf of the distribution looks like this. It's very centered around the mean,"
],
[
75.2,
"which means you're pretty sure that the outcome of the event or realization of the random variable is going to be somewhere close to the mean value."
],
[
86.6,
"As opposed to the distribution where you have a big variance, the distribution has a big variance that is very spread out,"
],
[
94.0,
"meaning all the values have a pretty big probability of a curve. You have equal probability of a curve for a lot of different realizations of a random variable."
],
[
106.1,
"That's the way to characterize how spread out a distribution is."
]
],
"excel-functions": [
[
0.2,
"And the similar flavor, we can construct things like the sample variance estimator, sample covariance estimator,"
],
[
7.0,
"and sample correlation estimator."
],
[
9.4,
"I'm not going to show you how to"
],
[
12.9,
"do it in the Excel, the Excel actually has some built-in functions that can automatically report the sample mean,"
],
[
21.2,
"sample variance, sample covariance, and sample correlation within the following function. The average gives you the sample mean,"
],
[
28.6,
"the variance, the var.s gives you the sample variance, the covar.s gives you the sample covariance,"
],
[
35.6,
"and the co-real gives you the sample correlation. So those are the estimated"
]
],
"histogram": [
[
0.0,
"Summary statistics compress; a histogram shows the whole shape."
],
[
4.3,
"It cuts the range of the variable into bins and counts how many observations fall into each."
],
[
11.0,
"Switch between price and carats, and move the slider for the number of bins."
],
[
15.9,
"With five bins you lose the shape; with forty you mostly see noise."
],
[
20.6,
"Something like ten to twenty is usually right for a few hundred observations."
],
[
26.1,
"Notice the carats histogram: diamonds cluster at round sizes like one carat, because that is how they are cut and sold."
],
[
34.2,
"The orange line is the mean and the dashed line the median."
],
[
38.7,
"For price they are close, so the distribution is roughly symmetric."
]
],
"python-describe": [
[
0.0,
"Here is the same thing in Python."
],
[
2.2,
"The cell runs in your browser; press Run."
],
[
5.4,
"Pandas reads the file, head shows the first rows, and describe prints the count, mean, standard deviation, minimum, quartiles and maximum of every numeric column."
],
[
17.4,
"The last lines draw the histogram of price."
],
[
20.5,
"Change price to carats and rerun, and try forty bins."
],
[
24.8,
"The first run takes a while because your browser downloads Python; after that it is instant."
]
],
"relationships": [
[
0.2,
"Now, let's talk about something fancier that describes the relationship between random variables. Previously, we focused on one single random variable."
],
[
10.0,
"There are also tools to describe the relationships. And the relationship is actually a lot more interesting than describing a single variable."
],
[
17.4,
"If you think about the questions we have raised previously, the black car, a small car example,"
],
[
24.9,
"what we're really interested in is not the black car itself. We don't actually care about how many cars in the United States are black cars."
],
[
32.8,
"We care about the effect of black cars on the accident rates. So we want to characterize the relationship between a pair of variables."
],
[
42.4,
"And a lot of times, we care a pair of random variables. right so the questions people are usually interesting are the questions like education and salary whether i should get this degree how that improve the net present value of my lifelong income price and quantity for a manager want to set a price for a product they want to understand how the price would affect the sales and that's we need to build a relationship between p and q price and quantity and similarly quality and price and if i improve the the iphone in this certain functions how would that increase the price or consumers willing to pay for my products and lastly stock price and earnings if the firm has good performance how would that affect the stock price so in real life the questions we're interested in are mostly related to a pair or more variables."
]
],
"scatter": [
[
0.0,
"A scatter plot puts one dot per observation: here carats across and price up."
],
[
5.6,
"The cloud rises to the right, so bigger diamonds cost more, and it widens as it rises, so the prices of big diamonds vary more."
],
[
15.3,
"Tick the first box to see the point of means, the average carats and the average price."
],
[
20.8,
"Tick the second to add the least-squares line, which always passes through that point."
],
[
26.7,
"Part four shows where the line comes from."
],
[
29.5,
"In Excel, select the two columns and insert a scatter chart; a right-click on the dots adds a trendline, and you can display its equation on the chart."
]
],
"correlation": [
[
0.0,
"The correlation puts one number on a scatter plot."
],
[
3.2,
"Start from the covariance: the average product of the two deviations from the means."
],
[
9.0,
"It is positive when X and Y tend to be high together, but its units are odd, carats times dollars."
],
[
16.4,
"Dividing by the two standard deviations removes the units and gives a number between minus one and plus one."
],
[
24.5,
"Plus or minus one means the dots lie exactly on a line; zero means no linear association."
],
[
31.9,
"For the diamonds the correlation is 0.80."
],
[
35.7,
"Its square, 0.65, is a number you will meet again as the R squared of the regression."
],
[
42.5,
"One warning that never goes away: correlation says the variables move together, not that one moves the other."
]
],
"guess-corr": [
[
0.0,
"A small game to calibrate your eye."
],
[
2.3,
"Each cloud has sixty points drawn from a population with some correlation."
],
[
7.1,
"Move the slider to your guess and press Reveal."
],
[
10.6,
"Then ask for a new cloud."
],
[
12.7,
"After a few rounds you will see that 0.3 is a very loose relationship, 0.8 is clearly a line, and the sign simply tells you whether the cloud rises or falls."
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
"xt-why": [
[
0.2,
"But first, let's talk about the pivot table"
],
[
4.4,
"or the estimating the conditional expectations."
],
[
7.6,
"So whether we want to do a prediction or the cost of measurement, which we discussed last week,"
],
[
13.5,
"but the key input is always to get the conditional expectation, which helps us to link two variables."
],
[
20.0,
"Back to the clinical trial example, the conditional expectation we're interested in is expected health outcome,"
],
[
28.1,
"conditional on the patient being in the treatment group or the control group. So that's a conditional expectation."
],
[
33.8,
"You can form the outcome of interest into some form of the conditional expectation. We want to learn ways to actually estimate the conditional expectations."
],
[
45.1,
"So it's more complex than estimate unconditional things like unconditional mean, which we talk about in the online video last week."
],
[
53.2,
"We can draw a bunch of observations from the population and just calculate the sample mean."
],
[
60.6,
"And by the advantage of law of large number and central limit theorem, we actually know a lot about how our sample unconditional average can be informative of the population average."
],
[
72.0,
"But now the goal is more complex because we are interested in a conditional expectation, the conditional expectation in the population."
],
[
82.0,
"The question is how we can construct our sample using the statistic method to use the sample to inform us about these conditional expectation in the true population."
],
[
93.0,
"Just like the method we have used to estimate the population mean, unconditional mean, the way we're going to construct this thing is basically a quite similar approach."
],
[
104.8,
"It's the estimation approach. We want to construct an estimator that tells us something about the population truth and ideally have some nice properties that we want the estimator to be unbiased,"
],
[
117.3,
"to be asymptotically normal, and so on and so forth. So I'm going to start estimating this conditional expectation using a method called cross-tab or the pivot table."
],
[
128.5,
"So let's first take a look how they work."
]
],
"xt-when": [
[
0.2,
"So one way to describe the relationship between variables is by plotting the variables or just calculating the correlations."
],
[
9.8,
"So this is useful, and this is basically a way of summarizing the data."
],
[
17.7,
"But there's some limitations why we don't always want to do the scattered plots or correlations."
],
[
24.8,
"Part of the reason is that the data might not be numerical. I'm going to show you one data that we don't have numerical variables almost everywhere."
],
[
33.3,
"So you have all the variables that are categorical, meaning they either take the value of something or the other,"
],
[
39.4,
"but they're non-numerical. In those cases, a powerful method for capturing the relationship would be the pivot table."
],
[
47.8,
"And they can also be used to compute the conditional means when conditional variables are just,"
],
[
52.9,
"as I mentioned, binary or categorical. Okay, so how do we do the crosstabs? I'm going to show you how to do the crosstabs in Excel and then ChatGPT,"
],
[
62.4,
"you can potentially also do the crosstabs in Python, which is not super straightforward. So that's why I'm going to use the Excel primarily when I show the crosstabs."
],
[
73.1,
"Excel, it's called the pivot tables, because Excel was so popular in the past 30 or 40 years,"
],
[
79.3,
"it was so successful. Nowadays, people just use the word pivot table and crosstab exchange. with it."
]
],
"xt-titanic": [
[
0.2,
"Now let's take a look at the example of the Titanic example. You can find the data set on the Blackboard under the Week 2 module."
],
[
10.2,
"So the background, as many of you have been quite familiar with, of the Titanic is that Titanic is arguably the biggest ship during the time,"
],
[
20.3,
"but it tragically sunk and it's made of a voyage from Southampton to New York City."
],
[
25.7,
"I think sank Newfoundland in Canada. That was about 100 years ago. We're going to explore that data set to see how the different attributes predict or related to the survival of the passengers on that ship."
],
[
43.4,
"You can see the data set looks like this. We have four different variables, class, age,"
],
[
49.0,
"gender, and survival. By the way, I recommend you to open the Excel book along with me so we can do the pivot table together."
],
[
59.1,
"So four different variables. The class denotes whether a passenger is in different cabins, different class on the Titanic."
],
[
67.2,
"So I think there are four different classes, first class, second class, third class, and the crew members."
],
[
73.8,
"So at that time, actually there were a lot of crew members"
],
[
80.3,
"So age is the binary variable that takes two values, either adult or non"
],
[
92.1,
"-adult, basically."
],
[
93.8,
"I cannot remember what word I use, young here, yes, adult or young."
],
[
100.5,
"The gender is also two values, male or female. Survival takes two values, yes, means basically the passenger made it,"
],
[
108.2,
"or no, the passengers didn't make it."
],
[
111.7,
"and died due to this tragic. So what I'm trying to do is to estimate the conditional expectation of this Titanic data set."
],
[
123.2,
"So what I'm really interested in is the expected value of y conditional on x. Here in particular,"
],
[
130.5,
"the y variable, the outcome variable, we're interested in is survival. And the x variable is the different demographics or attributes of the passengers on the ship."
],
[
140.4,
"So we want to learn what the survival rate conditional passenger is in a certain class,"
],
[
146.3,
"or conditional passengers are adults or young at the young age or youth."
]
],
"xt-excel": [
[
0.2,
"So how can we do that? So the pivot table is the first to do the pivot table."
],
[
5.8,
"First, we select all the data. One trick of selecting all the data is first you select the first row,"
],
[
12.7,
"and then you click the Shift Control downward button. and then automatically Excel is going to select all the data you have."
],
[
22.3,
"You can also do the Control-A, which also selects all the data either way. And then you can go to the Insert panel and see the pivot table here."
],
[
31.5,
"It's the leftist option in the Insert panel. You click the pivot table and you can choose where you want the pivot table to be placed."
],
[
41.1,
"I'm going to place the pivot table in a new worksheet. So here you go and find the worksheet of the pivot table."
],
[
50.2,
"It's empty now because I didn't add anything into the table. So here on the right-hand side,"
],
[
55.9,
"you can see something called the pivot table fields. So this includes four variables. We just mentioned the class,"
],
[
62.9,
"age, gender, and survival. And we can do fancy things by moving those variables into different places."
],
[
70.4,
"First, we want to move the scenes we want to conditional on to the rows. So first,"
],
[
75.1,
"let's take a look at how class predicts or affects the final outcome of survival. So we just move the class,"
],
[
83.3,
"we drag the class all the way to the rows."
],
[
86.9,
"And move the class here. You can see we have four different row labels, crew member,"
],
[
92.4,
"first class, second class, third class."
],
[
95.2,
"An outcome we are interested in is survival. So we move survival to the columns. So you have a yes or no."
],
[
103.6,
"And finally, we have to move survival also to the values, because we want to count the number of survivals among the crew members,"
],
[
111.3,
"first class, second class, and third class. So what we see here are the numbers, basically the number of observations that fall into each of the cell."
],
[
120.6,
"So this basically means crew members that didn't survive. This is crew members that survived."
],
[
128.1,
"But what we have here is not conditional expectation. It's sort of the sum of the number of observations we have."
],
[
135.9,
"So in order to make the value more meaningful, we can change it to the expected value."
],
[
142.9,
"How can we do that? We go to the values, we can choose something called the value field settings,"
],
[
149.7,
"we click the value field settings. And here you can do show value as. So instead of doing no calculation,"
],
[
156.2,
"we can show value as the percentage of the row total. By calculating the percentage of the row total,"
],
[
162.8,
"basically we calculate among all the crew members how many crew members survived the Titanic crisis."
],
[
170.0,
"So we're going to get the estimate of the conditional expectation of survival conditional on being a crew member."
],
[
178.5,
"So it's essentially 23.95%. So conditional being a crew member is 23% or 24% likelihood the crew member is going to survive the Titanic crisis."
],
[
190.5,
"Similarly, you can interpret the other outcomes. So here we have the expected survival rate of the first class being a first class passenger,"
],
[
199.7,
"a second class, a third class. You see the differences in the conditional expectation. So essentially what we have here is the conditional expectation of survival,"
],
[
214.5,
"conditional cabin or the class of the passenger equals to something."
]
],
"xt-causal": [
[
0.2,
"This is what we have."
],
[
4.6,
"Now, is this a causal relationship or is this more like a correlation relationship?"
],
[
10.2,
"As we discussed last week, the golden rule for causal relationship is their experiment."
],
[
16.7,
"So what we observe on Titanic is clearly not an experiment, meaning in what class, in what cabin is not exogenously chosen or randomly assigned by the nature or somebody else."
],
[
29.9,
"So basically, people self-sorted into different cabins based on their income or other things. So here,"
],
[
38.3,
"in some sense, we shouldn't interpret that as the causal effect of being in the first class on the survival."
],
[
45.3,
"it's more likely to be a complex thing, like a combination of being in the first class,"
],
[
50.7,
"which means the passenger is potentially closer to the deck, means the passengers are closer to the rescue boat,"
],
[
57.5,
"so they have a bigger survival rate, and also be related to other things, like the characteristics related to the first class passengers."
],
[
67.7,
"It could be that they tend to be older, or they have higher income, something like that."
],
[
75.0,
"So how to interpret this number that the first class have a bigger survival rate than passengers in the third class,"
],
[
82.0,
"that is sort of a narrative. It's clearly a setting without a natural experiment, but there are lots of potential mechanisms."
],
[
90.6,
"It's probably a lot of historical people study history trying to figure out what's happened on the ship."
],
[
98.5,
"But again, it's a narrative and we couldn't just draw a causal relationship from the numbers we have here."
],
[
105.2,
"But we do have some correlation that's useful. You see, it tells us that if I happen to know someone is a first class passenger on Titanic,"
],
[
115.4,
"I know that person has a much bigger chance of surviving compared to a passenger who is a crew member or the third class."
],
[
122.7,
"That's sort of the way to interpret the results."
],
[
128.8,
"So that's one example."
]
],
"xt-more": [
[
0.0,
"we can also add the gender into the pivot table. So we can do it in multiple ways."
],
[
6.5,
"First way is let's remove class and just move gender to rows. And similarly, we have the survival in the columns and the values."
],
[
15.4,
"And we change the value field settings to report the percentage of row total. And here you're going to get a survival conditional gender."
],
[
27.0,
"Here you see being a female, a female member means you have a much bigger chance of surviving in Titanic,"
],
[
34.4,
"which sort of tells a story that the passengers seem to show some shivery during that process,"
],
[
40.5,
"like they let the female to go first, to go to the rescue boat, because there's some limited capacity on the rescue boat."
],
[
46.9,
"But again, that's a story, that's a narrative, it's not exactly contained in these numbers. But if we talk to the people who survived the Titanic,"
],
[
55.9,
"we can probably confirm that's a true narrative that that's what actually occurred on the titanic ship right so when we interpret the statistics we have to always try to combine the statistics with some anecdotal evidence try to find the right narrative uh yeah and similarly we can also move h to the rows and you're also going to find that the young passenger indicates a bigger likelihood of surviving the titanic crisis And you might wonder,"
],
[
86.2,
"like previously we have shown only one x on the right-hand side, can we have multiple x?"
],
[
92.4,
"Can we see a conditional on both class and gender? What would that imply on the survival rate?"
],
[
99.8,
"The answer is yes. What we need to do is just to drag both gender and class to the roles."
],
[
108.2,
"And then we're going to have a more complex or unwieldy pivot table, which shows a lot of numbers."
],
[
116.2,
"The interpretation is similar. So here you have the female members who is in the first class."
],
[
124.6,
"You see a very, very high survival rate. You also see female members in the third class,"
],
[
130.9,
"which have a relatively lower survival rate, but still much higher than the male passengers in the third class."
],
[
136.9,
"So you can do this thing by adding both class and gender on the right-hand side,"
],
[
143.3,
"basically conditional on both class and gender."
]
],
"xt-cells": [
[
0.1,
"And you can also do that if you want to move the age as well. Now the table really become pretty huge."
],
[
7.1,
"And you see some predictions that's pretty interesting that you see the first class young female have 100% survival rates."
],
[
16.4,
"You might wonder what does that mean? One way to think about the results is here,"
],
[
21.7,
"let's take a look at the numbers, the total numbers we have."
],
[
25.3,
"Instead of showing the percentage points, this time, let's just show the number of observations. So how many number of observations we have for that particular cell?"
],
[
33.5,
"If you have only one observation. So that's the intrinsic trade-off of splitting the sample into more groups."
],
[
40.5,
"And if you split the sample into more cells, like by interacting class and gender and age,"
],
[
46.1,
"you might have some cells where you only have very few observations, one observation or five observations here."
],
[
53.5,
"And the tricky thing is that, as we learned, law of large numbers and central limit theorem,"
],
[
59.5,
"those nice statistic properties only hold if we have a big enough sample. And how big is big enough?"
],
[
66.3,
"It's like an empirical question, but of course, like one observation or five observations, we wouldn't say that's big enough."
],
[
72.2,
"So here's a trade-off. So as you move more and more variables to the right-hand side,"
],
[
76.9,
"you basically diminish the effective sample size you have by estimating this condition expectation. If you only have one sample,"
],
[
84.4,
"then we shouldn't be very confident on what we get. We shouldn't be confident to interpret that as a population condition expectation."
],
[
92.2,
"So that's one downside of doing pivot table and having a lot of things on the right-hand side."
],
[
99.7,
"Another downside is that, as you can see, the result is very flexible, but at the same time,"
],
[
106.0,
"very hard to summarize. You don't see a single number or a few numbers that tell you a consistent story."
],
[
115.1,
"Rather, you have to deal with all those numbers that are sometimes higher than the other,"
],
[
120.4,
"sometimes lower than the other."
],
[
122.6,
"It's very difficult to interpret. If you want to summarize the results in English or in a human language,"
],
[
129.2,
"it's very difficult to draw any insights from this table that human can actually understand in a few seconds."
],
[
138.3,
"So that's kind of the downside of the pivot table. There's one, another downside, which I haven't mentioned here,"
],
[
145.5,
"but we're going to see in the next example, is that pivot table doesn't deal with continuous variables very well."
],
[
152.3,
"right because you can see here in the titanic example we have all the variables in categorical values a class takes only four values age only two values gender only two and survival only two so we're dealing with a lot of variables that only takes very few values but instead if instead you have a beta set that takes continuous number of values it's going to be very difficult to do pivot table because now you have to split the data into different groups."
],
[
183.3,
"Because the variable is continuous, you're going to have a lot of groups, an infinite amount of groups."
],
[
189.5,
"And that's essentially impossible to do in the pivot table setting."
]
],
"xt-tryit": [
[
0.0,
"Now build the tables yourself."
],
[
1.9,
"Choose a row variable, a column variable, and what each cell should show: the number of people, the survival rate, or the share of the row."
],
[
10.9,
"Try gender by class with survival rates, then switch to counts and look at how many people stand behind each rate."
],
[
18.6,
"Then try age by class: there were no young crew members, and the young cells are small everywhere."
]
],
"xt-python": [
[
0.2,
"Another thing I'll probably try to do as well is to show the power of ChatGPT."
],
[
4.8,
"We can see how ChatGPT can help us to do the pivot table. So what I'm going to do is to first open the ChatGPT."
],
[
14.3,
"So I'm using a subscribed version, which allows me to go to something called the data analyst,"
],
[
21.1,
"which is very useful, as you can see. The good thing about data analyst compared to the plain of vanilla ChatGPT is that if you do the data analysis,"
],
[
31.0,
"ChatGPT is not only giving you the answer based on the language models, ChatGPT is actually going to call Python to run some codes and give you the outcome,"
],
[
42.8,
"both the outcome and the code. So it's useful in that sense, because you're not only going to get an answer,"
],
[
49.3,
"you have a clear sense of what's the thought process ChatGPT has to get that answer."
],
[
56.3,
"i think one takeaway here is that as you can see on excel doing a pivot table is very very simple you just drag variables to different locations but in python actually if you do a pivot table you have to write down codes and pretty long codes and it's not super intuitive straightforward code that's why i think most people still do the pivot table on excel in the workplace because excel is sort of more suitable to do data tasks like just showing pivot tables,"
],
[
85.3,
"while Python is better suited to do more advanced statistic analysis. That's why, although nowadays there are many sophisticated methods,"
],
[
97.0,
"Excel is still our good old friend and still quite popular in many workplaces."
],
[
102.7,
"It does a lot of jobs pretty well. I think it's better than Python."
]
],
"xt-cps": [
[
0.2,
"All right, so that's about the Titanic."
],
[
4.3,
"We're going to spend a little bit of time on another example of cross-taps, and then we're going to move to the linear regression."
],
[
12.2,
"This is the example that's, I think, more closely related to our everyday life. So it's a kind of a labor economics question from a data set called the CPS."
],
[
23.7,
"So CPS stands for the Current Population Survey, 1999, basically conducted in 1999. The Current Population Survey is conducted by the Department Department of Labor in the United States every five years."
],
[
37.5,
"The goal is to survey labor workers on things like their working hours, education years, things like that,"
],
[
46.4,
"to figure out what determines the wage, what explains why some people earn more than the other,"
],
[
51.7,
"and the overall wage rates in the country. So here we have a data that's a sample of 6,000 full-time workers in five North Central states."
],
[
65.3,
"So we have five variables in these data sets. The usual hours worked, education, yearly earnings,"
],
[
72.2,
"race, and gender, right? So here, the labor question many people will be interested in is how wage depends on lots of different characteristics."
],
[
82.3,
"And if I want to learn how the, what's the education return on wage, I want to make the X variable that education gives."
],
[
90.5,
"if i want to learn how the if there's a gender discrimination or the the race discrimination in the workplace i want might want to replace x with race and gender to see whether we see differences in earnings across different demographic groups it's suitable to answer those type of labor questions i'm going to explore a little bit how we can use pivot table to answer the questions and also see why sometimes we want to move to a regression because here you can see we have we do have some continuous variables,"
],
[
121.7,
"such as education."
]
],
"xt-cps-gender": [
[
0.2,
"OK, so as usual, we just first select all the data we have."
],
[
5.7,
"We're selecting the region of all the data, and we can insert the pivot table and just place the pivot table into a new Excel."
],
[
16.6,
"And we can move things around and answer the questions we're interested in. So what are the questions?"
],
[
22.3,
"First, you probably want to see how the gender determines how much you get paid."
],
[
28.1,
"So let's see, we want to move the gender to rows, and here we want to calculate the expected value,"
],
[
35.2,
"which is earnings, conditional on gender. So we move the yearly earnings to the values. Here we get the sum of the earnings,"
],
[
44.3,
"which is again not useful, because we want to get the expected value, which is the average of yearly earnings."
],
[
50.7,
"This net of a sum, we summarize the value field by the average, that expected earnings conditional on the gender."
],
[
60.3,
"We can see the male on average earned $47,000, the female earned about $30,000 back in 1999."
],
[
68.4,
"We see a pretty big gender reach gap. Should we interpret that as discrimination or if that explains by other things,"
],
[
76.0,
"it's we're back to the question, it's a correlation or it's a causal relationship."
],
[
81.5,
"So if it's to disentangle those two, one thing we might think about is to try to figure out the mechanism."
],
[
90.0,
"So one mechanism people might come up with is that education might explain the gaps. Might be the case that the males actually spend more time in education,"
],
[
101.4,
"get higher degrees, so they actually earn more. So the apparent gender differences in wage might be explained by the correlation between gender and education."
],
[
111.7,
"So as we mentioned last time, we could figure out whether that channel explains the differences."
],
[
118.9,
"How do we do that? We just add not only the yearly earnings, but the education."
],
[
124.6,
"We can just show what's the average education for those two groups. We move not only the yearly earnings,"
],
[
131.0,
"but also educations to the value fields. And again, you're going to get the sum of educations,"
],
[
136.7,
"which is not useful. So let me change the value field settings to the average. And here you see the two groups actually have pretty similar education levels."
],
[
147.2,
"So if anything, the female actually has slightly longer education years than the male group. So you see,"
],
[
154.3,
"at least if there's a correlation, the correlation cannot be explained. the education. So that's something we could learn from this pivot table exercise."
],
[
164.5,
"So you might think another channel which is the working hours. So arguably male might work longer hours because they take less domestic tasks like taking care of the child."
],
[
175.2,
"So we could also move the usual hours worked to the values and to calculate expected usual hours worked conditional on different gender."
],
[
185.0,
"So again, instead of showing the sum, I change the value field settings to the average."
],
[
191.3,
"Right here, you do see male works slightly longer per week than female group. The difference is like three hours."
],
[
197.9,
"It's clearly much smaller than the differences in the average yearly earnings. It seems the usual hours might be one channel,"
],
[
206.1,
"but it doesn't explain. It doesn't seem the magnitude is big enough to explain the gap we observe here."
],
[
212.2,
"So you can probably also rule out that chain."
]
],
"xt-cps-educ": [
[
0.2,
"Another question you might wonder is does the gender wage difference exist in different education groups?"
],
[
6.6,
"One argument is that probably female are more discriminated than they only have like low years education."
],
[
14.9,
"Like blue collar workers, you see more gender discrimination than the white collar workers or high education workers."
],
[
21.0,
"To see whether that's the case that we cannot only, we couldn't learn from the average education,"
],
[
26.8,
"and we need to see the expected earnings conditional on gender and education. So basically the claim I just made is that if the education is high,"
],
[
42.6,
"probably you won't see a big difference in the conditional expectation of earning on gender compared to when the education is low."
],
[
49.9,
"So to answer that,"
],
[
52.4,
"So we have to move the education years to the row labels. That's basically conditional on both gender and education."
],
[
60.9,
"Now if we do that, you have a pivot table that's conditional on both female and male and the education years."
],
[
73.0,
"First, you can see one drawback of pivot table, which is when you have a continuous variable,"
],
[
78.0,
"it shows the values, all the potential values of that continuous variable. So you might see some very weird numbers,"
],
[
84.7,
"which I'm going to show you later. But first, let's see our question, see how the data speaks to our question."
],
[
90.3,
"Do we see a gender gap disappear when a female gets higher education levels? So basically what I'm going to do is to compare the average earnings of the people with the very high education."
],
[
104.4,
"16 years is like college, 18 years is going to be post-college, like master or higher degree."
],
[
110.5,
"And it has to see, still, the gap exists, even when a person achieves pretty high education,"
],
[
117.6,
"a similar gap exists for the low education. And so actually, you can also rule out the hypothesis that a gap only exists for blue-collar workers with low education years."
],
[
130.3,
"Yeah, that's what we can learn from using the data to test different mechanisms, different hypotheses,"
],
[
137.5,
"and rule out different stories."
],
[
142.0,
"Yeah, so again, that's back in 1999. Later in the regression analysis, we are going to see the current population survey in more recent years and see how things change."
],
[
152.5,
"You might be curious what would happen, and we're going to see that in the next few weeks."
]
],
"xt-outlier": [
[
0.2,
"But before I do that,"
],
[
2.4,
"here you see some weird numbers or statisticians would call the outliers in the data. For example,"
],
[
10.2,
"here in the male group, you figure out the expected earning condition on getting nine years of education is actually 30,000,"
],
[
19.1,
"which is greater than getting like 11.5 years of education."
],
[
23.8,
"By the way, I think in the United States, the compulsory education a person has to get is 11.5."
],
[
29.0,
"But back in 1999, you have some people or below that compulsory levels of education. But you still see this very weird number this outlier which says that conditional uh getting nine years of education you actually have a higher expected earnings than getting like two more years of education right"
],
[
50.1,
"So let's see whether that's the case. So instead of showing the average of yearly earnings,"
],
[
54.7,
"we could also report the number of observations we have. So we report the count, basically tells us how many people fall into different categories or different baskets."
],
[
66.4,
"So what you see here is that you have only 28 observations in this group. In other bins,"
],
[
73.9,
"you have more or less close to 100. As it seems, we don't have a large sample here."
],
[
79.5,
"Let's quickly explain, because a lot of large numbers tells us this number is going to converge to the population truth if and only if n is big enough to send n to infinity here is probably we only have 28 draws right it's possible i get a person who is a very special who earns a lot and that person single-handedly make the condition expectation in the sample super big so to verify if that's the case we could move the yearly earnings and instead of reporting the average or the count,"
],
[
111.5,
"let's see the maximum, the max of the earnings in each group. And now you see there's a person,"
],
[
118.0,
"there's a guy in this group who made $300,000, remember that's 1999, with only nine years of education."
],
[
124.9,
"Perhaps that person got into some business like real estate or extract oil in Texas and made a fortune."
],
[
134.8,
"And it's clearly an outsider, because it's bigger than the average earning or the maximum earning in the people in the nearby groups."
],
[
142.5,
"So because we have that person in the sample who made a lot of money and I only made 28 draws in that group,"
],
[
150.6,
"so that kind of makes the number of the average value kind of biased. Because as you learn from the Ravis class,"
],
[
158.2,
"one downside about reporting average is that the average is very easily influenced by some extreme values."
],
[
166.7,
"Here is one extreme value."
],
[
169.6,
"The one way to address that issue is by reporting. Instead of the average, we can report the median."
],
[
175.7,
"But unfortunately, I don't think PivotTable allows you to report the median. Actually, you don't, you couldn't report the median."
],
[
181.9,
"That's something you could have in mind. It's just the median is less sensitive to the outlier or the extreme value compared to the mean."
],
[
191.9,
"Here's again what we could learn here."
],
[
194.6,
"This simple pivot table is actually pretty rich. You see the power of large numbers and why it wouldn't hold when you have a small sample."
],
[
202.8,
"Because you might have a bad draw. I mean it's a bad draw for us. It's a good draw for the person."
],
[
207.6,
"He made a lot of money."
],
[
210.0,
"And that's going to bias the results."
],
[
213.4,
"So, yeah, that's one lesson to learn. And another thing you can clearly see is that when you have a continuous variable or quasi-continuous variable such as education,"
],
[
224.4,
"sometimes you do want to impose slightly stronger structure on the data instead of showing just conditional expectations for each basket."
],
[
233.8,
"Because by showing each basket, you sometimes have some basket that you're basically running out of observations."
],
[
240.5,
"You have some basket, you only have 10 observations, some you only have 28 observations. You basically shouldn't trust each basket equally."
],
[
249.8,
"So that's another thing to keep in mind when you do a pivot tip."
]
],
"xt-discrimination": [
[
0.2,
"So let's get back."
],
[
2.6,
"The last question here is, is there evidence of discrimination? So again, it's very hard to tell just from statistics whether it's a causal relationship or not."
],
[
12.9,
"But what we have done here is to rule out a lot of hypotheses that basically says it's not a causal effect."
],
[
20.4,
"But again, it's very difficult to rule out all the potential hypotheses, especially because some mechanism is extremely difficult to collect data on."
],
[
30.7,
"So I'll go back to this question. It's how to learn, find the evidence of the causal effect on gender,"
],
[
38.8,
"on the learning, to see whether there is evidence on discrimination. Later on, When we talk about the design,"
],
[
44.1,
"the research design of the causal study, for now, let's leave it as an open question,"
],
[
49.8,
"because for now, on what we learn in the data, we can only say we rule out several channels people usually talk about on gender bias."
],
[
59.2,
"Things like education and how it worked. Clearly, they are not strong enough to explain the gender gap."
],
[
66.3,
"But still, we don't have strong evidence to say it's certainly discriminated. That's sort of the statistician's way to interpret results."
],
[
75.3,
"We can be super cautious in talking about the results to make sure we don't make mistakes of ignoring some potential channels."
],
[
83.0,
"And we're going back to revisit this example later. Okay."
]
],
"xt-limits": [
[
0.2,
"So that's what I try to talk about, about the crosstabs. To sum up, the crosstabs are a very powerful way to estimate conditional expectations and measure associations more broadly."
],
[
11.7,
"But they are not really easily scaled up to larger problems. By scale up, what I mean here is that,"
],
[
19.3,
"so suppose you are interested in not only those two things, you're also interested in adding more things like race."
],
[
27.9,
"Clearly you can see the race here. Also report if there's a race discrimination by adding the race into the pivot table,"
],
[
34.6,
"which makes the table even more unwieldy. You're going to have a lot more columns."
],
[
42.4,
"So that's what I mean. It's not easy to scale up. It's easy to show the pivot table."
],
[
47.8,
"You only have two variables. It's very difficult to show a pivot table when you have 10 variables,"
],
[
52.8,
"especially when you have 10 continuous variables. So it's not easy to scale up to larger problems."
],
[
59.7,
"and so we are going to figure out some more fancy ways to do to show the continued expectation on top of the pivot table"
]
],
"xt-to-reg": [
[
0.2,
"Okay, so now let's move on to the regression analysis."
],
[
4.9,
"Now the motivation of regression again is the same as pivot table. It's to understand the relationship between variables."
],
[
12.8,
"If you want to relate the relationship between x and y, we can ask two types of questions."
],
[
18.8,
"One is more on the causal side. If we change x, if we do something to x by a certain amount,"
],
[
26.7,
"what would happen to y? Questions like, if we spend $100,000 more on x, what would happen to the sales?"
],
[
34.9,
"Questions like, if I cut my price of my product by 10%, how would that change the sales?"
],
[
40.6,
"This is the first type of questions. It's the causal effect of x and y. There is a second type of question,"
],
[
47.2,
"the predictive analysis."
],
[
50.5,
"Questions like what's the most likely outcome of Y given a particular value of X. Things like how many units where I sell if I set the price P,"
],
[
61.0,
"if there are particular credit card transaction fraudulent, those are the prediction points. So crosstabs can answer both questions,"
],
[
68.9,
"as we saw in the previous examples, but they are not scalable. So regression analysis is targeted to solve this scalability issue right so for example if we want to establish a gender bias in earnings what we would like to do is really keep everything else constant besides the gender constant so which means instead of looking expected value of earnings conditional on gender we should be concerned with the expected earnings on gender age experience education etc on a lot of things we could control for and see conditional other things being the same we're really comparing two individuals that really observe visionally same to each other except their gender and see if we see any differences in earning so that's something we would hope to do if we really want to get some causal effect but it's likely to be too complicated to carry out with the pivot table as you know pivot table cannot handle a lot of variables on right-hand side."
],
[
131.6,
"I just showed you multiple times. Then we probably want to do something that's scalable and that's the regression analysis."
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
"ols-intro": [
[
0.2,
"Hello. In this asynchronous video, I'm going to talk about how to run regressions or obtain the regression estimates using Excel."
],
[
10.8,
"We're going to go through four different options. First one is a pretty crazy idea, which is to use the solver function on Excel,"
],
[
18.8,
"which probably you would never use again in your life, but I think it's very useful to see how the solver works and gain some intuitions."
],
[
28.8,
"The second way is to just directly use the formulas, which I have shown you in the class."
],
[
36.2,
"The third way is to use the intercept and slope commands on Excel, which will automatically compute those two estimates."
],
[
44.6,
"And lastly, we're going to discuss the Excel's built-in regression command. And after using Excel,"
],
[
51.4,
"in class we're going to show you how easy it is going to be to do a regression in either Python or R,"
],
[
58.5,
"those programming languages."
]
],
"ols-setup": [
[
0.2,
"The data set we're going to use for this example is a diamond data set."
],
[
5.7,
"So as we have discussed before, there are two key variables in this data set. The caret,"
],
[
11.7,
"which denotes the size or the weight of the diamond, and price, which is the price of the diamond."
],
[
17.7,
"So what we are going to learn is the relationship between price, which is a y variable,"
],
[
24.9,
"the left-hand side variable, or the dependent variable, how it depends on x, or the right-hand side variable,"
],
[
32.9,
"or sometimes referred to as the independent variable, the carats. So that's a goal, which is to figure out the relationship between price and carats."
],
[
43.7,
"And we know, as in linear regression, we make assumption that the conditional expectation of price on carats is going to follow a linear relationship,"
],
[
53.7,
"which is equal to the beta 0 plus beta 1 times carats. This is the assumption we have,"
],
[
62.0,
"and we have discussed the way we're going to estimate beta 0 and beta 1 is by searching beta 0 and beta 1 such that we want to minimize the sum of the squared residuals."
],
[
77.0,
"So that's sort of the plan we're going to have."
]
],
"xl-cells": [
[
0.1,
"So what we're going to do, we're going to first define two variables, beta zero and beta one."
],
[
6.1,
"So let's say, provide the initial guess on beta zero and beta one, let's say beta zero equals to 1,000,"
],
[
13.3,
"and beta one, the slope also equal to 1,000. That's our best guess,"
],
[
18.4,
"our initial guess, sorry. So to make things clear, simpler for the computation later on. Let me rename this particular cell."
],
[
29.5,
"Let's call it beta zero."
],
[
32.0,
"Let's rename this j4, rename this j4 cell. Let's call it beta one."
],
[
37.8,
"Okay,"
],
[
39.4,
"so later on, I can just type beta zero to refer to this cell, the j3 cell,"
],
[
46.5,
"and the beta one for the j4 cell. OK,"
],
[
50.8,
"so let's first see what's the price hat, our predicted price given our initial guess, beta 0 and beta 1."
],
[
59.1,
"So we know that best guess, according to this linear regression model, is going to be beta 0 plus beta 1 times the carats of that particular observation,"
],
[
72.9,
"which is 0.75. So you get a price tag, the predicted value using this linear regression model of the first carats in our sample is going to be 1750."
],
[
85.0,
"So we can do the same thing for all the remaining observations in our sample. So a quick way to do this is to double click this place."
],
[
94.7,
"I'm going to double click this place, you're essentially applying the same formula to all the cells below if you double click here right the model is going to generate predictions right which is essentially beta zero times beta one times the carrots of each observation"
]
],
"xl-resid": [
[
0.2,
"and then we can have a new variable for a new column which is the residual so or sometimes people say the error so what's our prediction error which is the difference between the price we observe in the data and the predicted price price hat given of the initial guess beta 0 and beta 1."
],
[
21.6,
"So we're able to calculate the residual prediction error for each observation. So again, you can double click here to apply the same formula to all the cells below."
],
[
32.9,
"So you basically get the prediction error for each of the observations if beta 0 equals 1,000 and beta 1 equals 1,000."
],
[
42.7,
"So what we're going to do is to calculate not only the residual but squared residual."
],
[
49.1,
"The reason we want to take square is to make sure we convert all the observations to a positive value."
],
[
55.5,
"So regardless of whether the deviation is a positive division or negative division, once we square the division,"
],
[
64.0,
"we square the arrow, it's going to be positive. So we're going to square the arrows and get the arrow squared for all the observations in the data."
]
],
"xl-ssr": [
[
0.2,
"Now, our objective is the sum of the squared residuals. So it's the sum of all the cells here."
],
[
9.1,
"So you can click the Shift, Control, Downward button, and you can select all the data in this column."
],
[
17.1,
"And you complete the bracket, and you're going to get the objective function, which is this value."
],
[
23.3,
"And so this is going to be the sum of the square residuals. If beta is zero equal to 1000 and beta y equal to 1000,"
],
[
31.8,
"right? So that's our initial gas of beta zero and beta one. Now we can change beta zero,"
],
[
37.0,
"beta one. For example, if I make beta one 2000, right? You're going to observe, right?"
],
[
42.3,
"The observed objective value is going to change as well, right? So previously it's, it's, uh,"
],
[
48.4,
"I don't know. it's a very big number it's like some 1 billion something if i change that to 2 000 right see actually the number becomes smaller 600 million right so it's smaller than 1 billion something so by changing the beta 1 to 2 000 you actually decrease the objective function so what we can do is to change this beta 0 and beta 1 as we like and until we find the objective function is minimized we find a point to which even if we adjust beta 0 beta 1 in any ways we couldn't decrease the objective function value even more then we're going to get these beta 0 head and beta 1 head that minimizes the objective value or the sum of the square residuals"
]
],
"fit-line": [
[
0.0,
"Here is the search as a game."
],
[
2.0,
"The sliders are beta zero and beta one; the red segments are the residuals, and the readout is their sum of squares."
],
[
10.4,
"Start where the video starts, 1,000 and 1,000, and try to make the number as small as you can."
],
[
17.4,
"The right panel shows the sum of squared residuals as a function of the slope: a bowl with a single bottom, which is why a search can find it."
],
[
26.7,
"When you are done, press the button to see the least-squares answer, and how close you came."
]
],
"xl-solver": [
[
0.2,
"so this sounds reasonable to do but it actually it's not simple right you have to change those two values like multiple times to decrease the objective value and it's hard to know when we actually reach the minimum and if you can find the person to help you do this you'll probably you'll be able to get the true value like in an hour hopefully so we don't want to manually search the beta zero beta one right so can we use excel to help us solve the beta zero beta one such that this number is minimized and luckily we could do that so what we are going to do is to use a command in excel called solver right so you can find it in the data panel here it's the solvable function right you click solver right so you have several things you need to specify in this in this solvable panel right so first you want to set the objective fund right objective is this particular cell that the sum of the squared arrows also we want to minimize the sum of square residuals so we to min to find the minimum value so by changing variable cells is essentially the the cells or the variables we want to search so we want to search different beta zero and beta one so those are the variable cells we want to change to minimize the objective so that's see everything we need to do."
],
[
87.0,
"Do we want to make unconstrained variables non-negative? Probably we don't, because we could allow beta 0,"
],
[
94.1,
"the intercept, or beta 1, the slope, take the negative value. So we don't want to make that constraint."
],
[
98.8,
"So let's uncheck this button."
]
],
"xl-solved": [
[
0.0,
"okay so you're going to see a a a window says solver has converse to the current solution let's keep the solver solution click okay here right you see the two estimates right beta 0 and beta 1 such that this sum of square residuals is minimized."
],
[
21.0,
"So when is it this value minimized? It's minimized when beta zero equals to minus 1679,"
],
[
27.1,
"and the slope parameter beta one equals to 5573. So you can actually verify it is minimized by changing those two values."
],
[
38.6,
"And whatever way you change those two values, you're going to observe an increase in the objective function."
],
[
44.0,
"So you know you're actually how very rich the minimum,"
],
[
48.6,
"right? So that's one way to actually solve the linear regression model. If you want to find the estimates by minimizing the sum of square residuals,"
],
[
58.6,
"you can just use the solver button, the solver function on Excel."
],
[
63.3,
"So I think it's nice because it's very intuitively show that mapping from the data set,"
],
[
69.3,
"the sample we have to the estimates we eventually obtain. So I think it's nice to do it once in our life."
]
],
"xl-formula": [
[
0.2,
"Okay, let's see what's the second way. The second way is to use the formulas directly."
],
[
6.1,
"So we actually mathematically solve the partial derivatives to find the mathematically speaking what's the beta 0 hat and beta 1 hat that is going to minimize the sum of squared residuals."
],
[
19.1,
"So you can find the beta 0 hat and beta 1 hat follow this following formula."
],
[
24.5,
"Okay,"
],
[
30.1,
"so here you have the formula. So the formula essentially says beta 1 hat is going to be equal to the covariance between x and y in our sample,"
],
[
40.6,
"divided by the variance of x in our sample. So if we want to calculate the beta 1 hat using this formula,"
],
[
49.1,
"what we're going to do is to first figure out the covariance between carrots and price,"
],
[
56.4,
"and"
],
[
60.0,
"then calculate the variance of carrots, variance of our x variable."
],
[
65.3,
"So the covariance between carats and price can be found using the covariance.s function."
],
[
73.5,
"But you have to input two errors. The first error is going to be the x,"
],
[
77.7,
"the carats. The second error is the y, the price."
],
[
83.3,
"We don't want the label, so we start on the c2 to the last observation. We're going to get the covariance."
],
[
91.3,
"And how about the variance? the variance, you're going to use the var.s. So that's the function in Excel that helps you to calculate the variance of a variable."
],
[
104.9,
"So you have caret, and you select all the observations."
],
[
109.9,
"And you're going to get the variance estimates of the caret. And the beta 1 hat,"
],
[
117.1,
"according to the formula, is just putting the covariance on the numerator and variance in the denominator and you're going to get this number which is the same as this number."
],
[
127.6,
"So you might notice that they are not exactly the same because there are some approximation errors when we use the solver to compute the beta 1 but you can see like all the integral parts they're the same."
],
[
140.6,
"They're both 5,573. So that's beta 1 hat."
]
],
"xl-beta0": [
[
0.2,
"Now how do we get beta 0 hat? The way we get beta 0 hat is by using the mathematical fact that the average value of x and y in our sample is going to be lying exactly on the regression line,"
],
[
18.3,
"right? So what we can do is to compute the mean value of y, the mean value of price in our sample,"
],
[
28.3,
"the mean value of caries in our sample, and then apply it to the second formula."
],
[
32.8,
"So the mean value of price is just the average of"
],
[
40.2,
"the price variable to get the mean price. You can also get the mean variance, which is the average function,"
],
[
48.4,
"applies to the carrots variable."
],
[
52.5,
"And lastly, the beta 0 hat is just y bar minus the estimated beta 1 hat times the X bar."
],
[
62.5,
"The X bar is here."
],
[
65.2,
"sorry, because the CX bar is here, J16, it's the mean caret, and you hit the Enter,"
],
[
72.1,
"and you're going to get the estimate of the beta0 hat, which is the same as the beta0 hat we solved using the solver function."
],
[
80.2,
"So this is the first method, and this is method 1."
],
[
87.0,
"What I just showed you, by applying the formula, this is the second method."
],
[
93.2,
"And let's move on to think about the other two methods."
]
],
"xl-intercept": [
[
0.0,
"The third method is going to be using the intercept and slope commands. So it's basically a refinement of this method."
],
[
9.5,
"So the method three says we don't actually need to manually copy the formula. So Excel actually stores this formula for us."
],
[
19.0,
"We just need to use the button or use a function called intercept. It's a function."
],
[
24.5,
"So you put the y variable first, and then you input the x variable,"
],
[
33.2,
"and you complete the bracket, and you're going to get the intercept. So those two things are the same."
],
[
39.9,
"You get the beta 0 hat just by using this intercept command. You can see here,"
],
[
48.3,
"intercept. them."
],
[
51.2,
"Now if you want to get the beta 1 hat, you can use a slope command."
],
[
55.3,
"So if you do slope, and similarly you put the y variable first, and then the x variable second,"
],
[
65.0,
"and you hit the enter button, you get the slope estimates, which is beta 1 hat."
],
[
69.7,
"You can also verify beta 1 hat is the same as the beta 1 hat here and the beta 1 hat here."
],
[
76.4,
"So this is our third method which is to use the excel function intercept and excel function slope"
]
],
"xl-regression": [
[
0.0,
"okay so let's see the last method which is the one i would prefer you to use in the future of the class which is to use excel's building regression command so it's nice that excel there's a command excel which you can find by going to the data panel and in data analysis function that you can find analysis tools."
],
[
22.5,
"One of them is called regression. You click OK."
],
[
27.8,
"Again, you have to fill in something in this window, but it's most intuitive. So we have to choose the input Y range."
],
[
35.7,
"You click this button. You can just select the range directly on the Excel file. So it's going to be from C2 to C381."
],
[
46.2,
"it's all the in our sample what's the bivariables we observe and similarly you can input the x range you can select all the x in our sample which is from starting from the b2 to b372 if you want and you can make several choices like whether you want labels whether you include labels we don't include labels so we don't want the labels uh for confidence level you probably wouldn't know what this mean right now they're going to explain this later right so the output options determines where you want to place the output right if you probably want to place the output in a new worksheet but let's select this and let's we can actually plot several things if you like for example if you want to plot the residual you can click this one and let's see what happens let's click okay"
]
],
"xl-output": [
[
0.0,
"right here you see the summary output right in a new excel worksheet and so the the regression function automatically generates a new worksheet that includes the things we're interested in okay so let's see this excel table right so there's several things you probably wouldn't understand what they actually mean right now uh don't worry you're understanding everything in about a few weeks okay let's focus on these two things so here you have something called coefficients so coefficients is essentially the estimate we have so the intercept coefficients is the intercept estimates beta zero the x variable is coefficient is essentially the slope parameter right so we have essentially the first cell here,"
],
[
50.6,
"it's a beta 0 estimate, beta 0 hat. The second cell here is the beta 1 hat,"
],
[
58.0,
"beta 1 estimate. So you can again compare the coefficients estimated by the Excel regression command,"
],
[
67.6,
"which is exactly the same as the beta 0 and beta 1 we estimated before, using several different tools and you always get same numbers."
]
],
"ols-lesson": [
[
0.2,
"Again, I think this is the most preferred way to do the regression because in addition to the coefficients,"
],
[
6.2,
"you get a lot more information that's going to be super useful later."
],
[
13.1,
"And another thing is, despite the method four is probably the preferred way, still show you some other method."
],
[
21.1,
"I think the key point I want to make is that I want to build an intuitive connection between the data and the estimates."
],
[
30.1,
"So you can see clearly that the data that estimates, it's just a function applying to the sample,"
],
[
37.6,
"the data set we have. The beta 0 and beta 1 is not fancy. There's no magic."
],
[
43.1,
"It's just some computations based on our data, and you're going to get these two values."
],
[
49.6,
"Okay."
]
],
"py-ols": [
[
0.0,
"In Python the whole of Part four is one line."
],
[
3.4,
"Statsmodels' ols takes a formula, price tilde carats, meaning price explained by carats, and the data; fit runs the regression."
],
[
13.5,
"The summary has the same blocks as Excel's output, and tables one is the coefficient table: coef is Excel's Coefficients column, std err the Standard Error, and so on."
],
[
26.3,
"The params are the intercept and the slope, and predict applies the line to new sizes."
],
[
32.0,
"The last lines compute the formulas directly, to show once more that nothing is hidden."
],
[
38.3,
"Try printing the full summary."
],
[
40.4,
"Then swap the formula to carats tilde price: regressing X on Y gives a different line, not the inverse slope."
]
],
"py-read": [
[
0.0,
"The two outputs are the same table with different labels."
],
[
3.9,
"Excel's Coefficients column is statsmodels' coef column; Standard Error is std err; t Stat and P-value are t and P greater than t; the 95 percent bounds are the interval in the last two columns; R Square is R-squared."
],
[
21.4,
"Even Solver's objective is there, as the residual sum of squares in Excel's ANOVA block and as model dot ssr in Python."
],
[
30.4,
"For now you only need the first row: the estimates."
],
[
34.7,
"The rest is the subject of the next sessions."
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
0.9,
"To describe one variable, report a center, a spread, the range and the count, and draw a histogram."
],
[
7.9,
"For two numeric variables, draw the scatter plot and compute the correlation, a unit-free number between minus one and one."
],
[
16.4,
"For categorical variables, compare groups with a crosstab, which is a table of conditional means; and always check how many observations stand behind each cell."
],
[
27.4,
"To fit a line, use OLS: it minimizes the sum of squared residuals, and whichever tool you use, Solver, the formulas, INTERCEPT and SLOPE, the Regression command, or one line of Python, you get the same two numbers."
]
],
"next": [
[
0.5,
"That's it for this module. If you want to keep the code, open the practice notebook."
]
]
};
