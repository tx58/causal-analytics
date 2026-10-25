// Auto-generated transcript of the 2024 recording (faster-whisper large-v3-turbo, lightly corrected).
// Written by code/cut_2024_audio.py. Times are seconds into each slide's clip.
window.ARCHIVE_TRANSCRIPTS = {
"title": [
[
0.2,
"Hello."
],
[
1.2,
"In this short Panopto video, I'm"
],
[
3.2,
"going to introduce the concepts of statistics and estimation."
],
[
8.2,
"Importantly, we're going to cover two important concepts"
],
[
11.5,
"in statistics, law of large numbers, LLN,"
],
[
15.2,
"and central limit theorem, CLT."
]
],
"prob-to-stats": [
[
0.1,
"So first, previously in the class,"
],
[
2.5,
"we have talked about the probability theory."
],
[
5.8,
"Now we want to move from probability theory to statistics."
],
[
9.4,
"So what are the key differences?"
],
[
11.7,
"Probability theory is about modeling"
],
[
14.2,
"and understanding randomness."
],
[
16.1,
"So it's like pure mathematics."
],
[
18.6,
"While statistics is about using data,"
],
[
22.0,
"or sometimes we call a sample, to learn"
],
[
24.4,
"the features of the population."
],
[
28.1,
"So in some sense, it's more like an applied mathematic"
],
[
31.2,
"tools to help us understand the underlying probability"
],
[
36.0,
"using a real data set."
],
[
39.5,
"The statistics is focused on making inferences"
],
[
42.3,
"about a group of individuals using data collected from a subgroup,"
],
[
46.7,
"which we usually call the sample."
],
[
49.9,
"However, sampling from a population involves randomness."
],
[
53.8,
"So probability theory is going to be used in statistics"
],
[
57.2,
"to capture and put structure on the uncertainty that arises"
],
[
61.8,
"from the sampling procedure."
]
],
"sampling": [
[
0.2,
"First, let me talk very briefly why sometimes we need to make a sampling"
],
[
4.1,
"from the population."
],
[
5.1,
"Why don't we study the population itself?"
],
[
8.3,
"And the reason is that in many cases,"
],
[
10.6,
"we couldn't be able to examine all the members of the population"
],
[
14.2,
"directly."
],
[
15.5,
"The reasons can be sometimes it's too expensive to learn everything"
],
[
19.4,
"about the whole population."
],
[
21.3,
"For example, it's quite expensive to get all the data"
],
[
26.5,
"from the whole United States."
],
[
28.4,
"That's why, although every few years, the government runs a census,"
],
[
32.8,
"the census only asks a few questions,"
],
[
35.0,
"because it will be very expensive to ask each individual 100 questions."
],
[
41.0,
"Another reason why we want a sample instead of population"
],
[
44.1,
"is because it's simply not possible to get the data for the whole population."
],
[
49.6,
"For example, we might want to learn something that would occur in the future."
],
[
54.3,
"There's no direct population of future that we can collect at the moment."
],
[
59.6,
"So instead, what we are trying to do is to collect the data in the past"
],
[
64.4,
"and assume the past is going to be representative of the future."
],
[
68.3,
"This is what many people do in the industry."
],
[
71.4,
"The managers would collect data from the recent past"
],
[
74.4,
"and use the data to forecast the sales"
],
[
76.8,
"or to do some statistical inference on the future sales."
],
[
80.7,
"So that's the underlying motivation"
],
[
85.1,
"why we want to do the sampling process."
],
[
88.9,
"Now, we do hope the sample is going to be representative of the population."
],
[
93.7,
"If the sample is not representative of the population,"
],
[
96.6,
"we would say the sample is either selective or biased."
],
[
101.2,
"If the sample is selective but biased, then if we use a sample,"
],
[
104.9,
"we wouldn't be able to learn the true population."
],
[
107.6,
"Rather, we learn something potentially of a subgroup, of a selective group,"
],
[
112.3,
"or we get some biased understanding of the population."
],
[
115.9,
"So ideally, we would like the sample to be representative."
],
[
120.1,
"And that's something we're going to assume mostly throughout the class."
],
[
123.9,
"If in the future we have time, we're probably going to discuss what can we do"
],
[
128.2,
"if we do have some sampling biases or if our sample is not truly representative."
]
],
"pop-sample": [
[
0.7,
"Now, to summarize what we have talked about, statistics is to use a sample"
],
[
6.6,
"to learn something about the population."
],
[
8.7,
"Or in plain English, to use what we observe in the data"
],
[
13.2,
"to learn what we don't observe in the underlying population."
],
[
16.7,
"So there are two different worlds in that sense."
],
[
18.9,
"We have a population world, which is represented by this box."
],
[
23.1,
"You can think about is the ground truth."
],
[
25.6,
"It's something we would like to learn about,"
],
[
29.6,
"but we couldn't collect data from the population"
],
[
32.1,
"because of the separate reasons we have talked about."
],
[
35.3,
"So instead, what we're going to do is to collect a subsample"
],
[
39.3,
"of the entire population."
],
[
42.2,
"We get a sample, which is a subset of the population,"
],
[
45.3,
"and we're going to learn something about the sample."
],
[
49.9,
"And we are going to use what we learn from the sample world"
],
[
53.6,
"to back out what's actually in the underlying population,"
],
[
58.6,
"in the ground truth."
],
[
60.0,
"That process is sometimes called the statistic inference."
],
[
64.0,
"It's about making statements about a population"
],
[
68.1,
"on the basis of a sample."
],
[
70.6,
"So because of that reason, now we have two different worlds,"
],
[
74.1,
"the population world and the sample world."
],
[
76.7,
"We have parameters in the population world"
],
[
79.7,
"that characterize, they help us understand the population."
],
[
85.2,
"And at the same time, there's going to be sample analog,"
],
[
88.3,
"which we use to learn of a sample."
],
[
90.4,
"But it's going to be indicative of the true population."
],
[
94.4,
"So we're going to have two set of parameters."
],
[
97.4,
"The population parameter on the left-hand side"
],
[
100.0,
"and the sample analog on the right-hand side."
],
[
103.5,
"For example, in the population, there's"
],
[
106.5,
"a true mean of the population, which we can write down"
],
[
110.0,
"as a mu of x."
],
[
111.7,
"A mu is a Greek letter that's used to represent the average."
],
[
116.8,
"On the right-hand side, we have a sample analog"
],
[
119.4,
"of that population mean, so we could write it down as x bar."
],
[
123.8,
"And x bar is sometimes called the sample analog"
],
[
127.1,
"of the population parameter."
],
[
129.0,
"It's a sample mean instead of the population mean."
],
[
132.0,
"So x bar is the mean we learn using the data in the sample,"
],
[
137.1,
"which we observe."
],
[
138.2,
"A mu of x is the mean of the underlying population."
],
[
142.5,
"It's a ground truth that we don't know."
],
[
145.3,
"Similarly, we can define the variance in the population world,"
],
[
149.5,
"the sigma x squared."
],
[
151.2,
"The sigma is usually used to denote the variance."
],
[
155.3,
"And we can also construct the sample analog,"
],
[
158.3,
"which is sometimes written as the s of x squared."
],
[
164.9,
"Now, another example you might think about"
],
[
167.3,
"to differentiate the population world and the sample world"
],
[
170.8,
"is to think about a finance setting."
],
[
173.7,
"And the population might be all the tradable assets in the economy."
],
[
178.2,
"The sample would be the stocks in the Wilshire 5000 index."
],
[
183.4,
"So the stocks in the Wilshire 5000 index,"
],
[
187.8,
"it's a sample of all the tradable assets in the economy,"
],
[
191.1,
"which should include not only stocks,"
],
[
193.6,
"but also real estates."
],
[
196.4,
"Now, which is not possible to be observed entirely"
],
[
200.7,
"by a researcher or the manager."
],
[
202.9,
"So instead, we're going to use a sample,"
],
[
205.5,
"which is the index found to represent the true population."
],
[
210.4,
"So we can construct the average return of that index found."
],
[
214.7,
"And at the same time, there's a sort"
],
[
216.9,
"of the ground truth of the return of all the average return"
],
[
220.3,
"of all the tradable assets in the economy."
]
],
"point-estimates": [
[
0.4,
"Now, we're going to introduce a very important concept,"
],
[
2.9,
"which is called the estimates, the point estimates."
],
[
6.8,
"There are three related things we're going to talk one by one."
],
[
10.8,
"The estimation, the estimate, and estimator."
],
[
17.8,
"So that's three very similar concepts,"
],
[
19.8,
"but slightly different."
],
[
21.5,
"Now, the process of using the sample"
],
[
24.9,
"to construct a sample analog to back out the population ground"
],
[
29.5,
"truth, that process is called the estimation."
],
[
32.9,
"And I'll come back to the previous example."
],
[
35.8,
"So we have a sample analog."
],
[
37.6,
"By constructing the sample analog,"
],
[
39.8,
"ideally, we can learn something about the ground truth"
],
[
43.4,
"of the true population average."
],
[
45.5,
"So the process of constructing that x bar"
],
[
48.6,
"to learn the mu of x is called an estimation."
],
[
53.8,
"That's the process."
],
[
55.7,
"Now, the point estimate is a number that used to estimate"
],
[
59.5,
"an unknown population parameter."
],
[
61.8,
"In the previous example, the x bar is going to be a number"
],
[
66.2,
"that is going to be used to estimate the population mean mu of x."
],
[
69.9,
"We're going to construct this x bar,"
],
[
72.8,
"and that is our estimates of the population mean."
],
[
77.0,
"So it's going to be a single number."
],
[
78.9,
"Now, the estimator is going to be a function."
],
[
82.0,
"Now, what is a function?"
],
[
83.5,
"A function is like a black box, and you have an input into a function,"
],
[
88.5,
"and the function is going to give you the output."
],
[
91.0,
"The estimator is a function that takes the sample data as an input,"
],
[
98.9,
"and it's going to generate or produce your estimates."
],
[
104.4,
"So by using the sample data to construct a point estimate,"
],
[
109.6,
"that function is called an estimator."
],
[
115.2,
"All right."
]
],
"estimators": [
[
0.3,
"So let's see some of the point estimators"
],
[
3.3,
"to see what the estimators look like,"
],
[
5.1,
"and also build a little bit intuition"
],
[
7.4,
"of why we use those things as estimators."
],
[
11.3,
"The sample mean estimator is sometimes written as x bar."
],
[
15.6,
"It's going to be equal to the average of all the xi's,"
],
[
19.9,
"summing from x1 all the way to xn,"
],
[
22.9,
"and then divided by the total size of the sample n."
],
[
26.2,
"So n denotes the sample size."
],
[
28.8,
"Sample size is essentially how many observations"
],
[
32.5,
"we have in a sample."
],
[
35.1,
"And the reason why we write this down as a sample mean"
],
[
37.7,
"is kind of intuitive."
],
[
39.8,
"So remember what the population mean in the probability theory,"
],
[
44.9,
"which is the sum of all the possible values taken by x"
],
[
50.9,
"times the probability that x takes the value of xi."
],
[
57.1,
"So here in the sample, we observe n outcomes."
],
[
60.6,
"Each sort of occurs with equal probability,"
],
[
63.5,
"which is 1 divided by n."
],
[
65.0,
"If we observe each observation only once,"
],
[
68.6,
"where the whole sample size is n."
],
[
71.2,
"So to write down the analog of that population average expected"
],
[
78.2,
"value, we can construct the sample mean estimator,"
],
[
82.6,
"which is the sum of all the observations in the sample"
],
[
86.0,
"divided by the sample size."
],
[
88.0,
"And the similar flavor, we can construct things"
],
[
91.3,
"like the sample variance estimator, sample covariance estimator,"
],
[
94.4,
"and sample correlation estimator."
]
],
"xbar-rv": [
[
0.3,
"So those are the estimators."
],
[
2.8,
"We show you intuitively why the estimator x-bar sort of makes"
],
[
6.8,
"sense because it's kind of the analog of that expected value"
],
[
10.9,
"of a random variable x."
],
[
13.6,
"And we also want to say that it is actually"
],
[
16.9,
"an ideal estimator."
],
[
19.0,
"So before we do that, I'm going to say one thing that's"
],
[
23.6,
"super important, that it's so important that it's going"
],
[
27.9,
"to be the building block of a lot of the materials we're"
],
[
30.4,
"going to cover later, such as regression analysis."
],
[
34.5,
"And this thing is to say that the sample mean, or more broadly,"
],
[
39.4,
"an estimator is a random variable."
],
[
49.0,
"Now, this is a super important statement."
],
[
52.6,
"It's maybe not super intuitive, but you might think estimate."
],
[
59.7,
"You might think estimate is a number."
],
[
62.7,
"So you can see, once we collect our sample,"
],
[
66.0,
"that we have a sample xi from i equals 1 to n."
],
[
71.0,
"So in the coin flip case, we might observe a sample of size 10."
],
[
75.7,
"So we observe 10 different coin flip outcomes."
],
[
79.2,
"We just want to denote head and 0 to denote tail."
],
[
84.6,
"We might observe some sequence like this."
],
[
89.2,
"And we use to say this is our sample."
],
[
91.8,
"You plug that in to the sample mean estimator."
],
[
95.0,
"And they're going to get a number."
],
[
97.3,
"In this particular case, x bar equals 0.5."
],
[
100.9,
"So x bar is actually a number."
],
[
103.7,
"If x bar is a number, if the estimate is a number,"
],
[
107.4,
"would I say at the same time that estimate"
],
[
109.8,
"is also a random variable?"
],
[
112.3,
"I'm going to pause here for a while"
],
[
114.1,
"for you to think about this question."
],
[
115.9,
"I'm going to give you the answer in a few seconds."
],
[
123.3,
"Now, the reason why an estimate is a random variable"
],
[
127.0,
"is because the randomness coming from the sampling process."
],
[
134.0,
"So in the underlying population, the population"
],
[
137.1,
"might follow some random distribution."
],
[
139.9,
"And we're going to collect a subsample from the population."
],
[
143.9,
"So in one particular realization of the sample,"
],
[
146.5,
"we might collect this subset of the population."
],
[
149.1,
"In another case, we might collect this subset of the population."
],
[
152.3,
"In a third sample, we might collect a different subset"
],
[
155.4,
"from the population."
],
[
157.0,
"Now, because there's some randomness in the sampling process,"
],
[
161.2,
"each time when I construct a sample of size n,"
],
[
165.9,
"each observation in the sample might be slightly different."
],
[
169.0,
"So think about if I flip the coin 10 times."
],
[
174.3,
"And if I do that 1,000 times, I'm"
],
[
177.4,
"going to construct 1,000 samples each time"
],
[
180.3,
"I flip the coin 10 times."
],
[
182.0,
"And each of the samples out of that 1,000 samples"
],
[
185.1,
"would be different."
],
[
187.4,
"So of course, if I construct a sample average estimator"
],
[
191.4,
"for each of that 1,000 samples, we're"
],
[
195.4,
"going to get a different sample mean estimate."
],
[
199.0,
"So in that sense, the estimate is a random variable"
],
[
201.8,
"because it inherits the randomness in the underlying population"
],
[
206.3,
"during that sampling process."
],
[
210.4,
"And that argument applies to not only the sample mean estimator,"
],
[
214.0,
"but also other estimators listed in the early slides"
],
[
217.3,
"and the estimators we are going to cover later on."
],
[
220.8,
"So that's why I say it's a super important concept"
],
[
223.5,
"that the estimate is a random variable."
],
[
226.3,
"Now, we have learned from the probability theory"
],
[
229.6,
"that if something can be viewed as a random variable,"
],
[
232.8,
"it's going to have a distribution."
],
[
235.8,
"And the distribution for the estimate"
],
[
238.6,
"is going to be called a special name,"
],
[
240.9,
"which is the sampling distribution."
],
[
242.8,
"We call it the sampling distribution"
],
[
244.2,
"because the distribution, there is a distribution"
],
[
247.4,
"because of the sampling process."
],
[
249.7,
"And also very importantly, we know there are several ways"
],
[
254.1,
"to characterize the distribution."
],
[
256.3,
"We can characterize the distribution using the sample mean,"
],
[
259.5,
"sorry, using the mean."
],
[
261.8,
"Or we can characterize the distribution using"
],
[
264.6,
"the standard deviation to characterize the distribution."
],
[
268.5,
"So if the estimate is a random variable,"
],
[
272.6,
"then the estimate is going to have its own mean"
],
[
275.5,
"and its own standard deviation."
],
[
278.7,
"So let's take a look what they are."
]
],
"mean-var": [
[
0.4,
"Now, this gets slightly confusing."
],
[
2.9,
"So first, let's take a look at the distribution"
],
[
5.0,
"of the sample mean."
],
[
6.2,
"Now, we say the sample mean is an estimator."
],
[
9.3,
"The estimator is going to have a random variable,"
],
[
13.1,
"and the random variable is going to have a mean."
],
[
17.0,
"And so we can actually write down the mean"
],
[
20.1,
"of the sample mean estimator."
],
[
22.1,
"So it's a little bit confusing in the sense"
],
[
24.0,
"that the x bar is called the sample mean estimator."
],
[
29.8,
"Now, the expected value is the mean."
],
[
32.8,
"And you can also say the expected value."
],
[
34.7,
"So we have a mean of a sample mean estimator."
],
[
37.7,
"So that's why it gets slightly confusing."
],
[
42.2,
"But I think it should be clear at this stage."
],
[
45.8,
"And this good thing is that the mean is going"
],
[
47.8,
"to equal to the population."
],
[
50.4,
"And why is that the case?"
],
[
51.5,
"And it's actually quite obvious in the case"
],
[
54.0,
"of the sample mean estimator."
],
[
56.7,
"If you write down the sample mean estimator,"
],
[
58.9,
"as you know, the sum of all the observations in the sample"
],
[
62.9,
"and then divided by the sample size."
],
[
65.1,
"So if you write that down, plug it in,"
],
[
67.9,
"you get the expected value of 1 over n times the sum of xi."
],
[
74.7,
"And then we know the summation is a linear function."
],
[
77.8,
"We can pass through the expected sign."
],
[
81.2,
"So we could write it down as the expected value of xi,"
],
[
86.0,
"sum of the expected value of xi, then divided by n."
],
[
90.0,
"And if the sample is representative,"
],
[
92.7,
"each single draw in the sample is a representative draw"
],
[
98.8,
"from the population."
],
[
100.3,
"So expected value of each draw in the sample"
],
[
104.4,
"is going to have the same mean as the sample mean."
],
[
109.0,
"And we have to multiply it by n times."
],
[
111.8,
"So eventually, you get mu subscribes x."
],
[
117.6,
"So this is very nice."
],
[
118.7,
"It tells us the mean of the sample mean estimator"
],
[
122.6,
"is going to converge to the population mean."
],
[
125.2,
"It's going to be the same as the population mean."
],
[
128.0,
"So it's a pretty good thing."
],
[
130.0,
"But it tells us the sample mean is correct on average,"
],
[
133.1,
"which means the sample mean estimator is not going"
],
[
135.6,
"to be systematically biased either up or down."
],
[
138.5,
"It's going to be an unbiased estimate"
],
[
141.1,
"of the true population."
],
[
144.7,
"The second useful fact is that the variance is going to equal"
],
[
148.0,
"to the population variance divided by the sample size."
],
[
152.0,
"You can also easily show this fact by, again,"
],
[
156.2,
"plugging the x-bar into the variance formula."
],
[
161.3,
"Now, importantly, if you want to move something out of the variance,"
],
[
166.0,
"then you have to square it."
],
[
169.4,
"So if you move this 1 over n out of the variance, you have to square it."
],
[
173.3,
"So you have 1 over n squared."
],
[
176.7,
"Now, you also have the summation of the variance of xi."
],
[
182.5,
"I think you already know that this thing is going to be the sum"
],
[
188.6,
"of the variance plus all the covariances between i and j."
],
[
194.8,
"Now, the covariance is going to be equal to 0"
],
[
198.8,
"if the sample draw is independent from each other."
],
[
203.4,
"So sometimes we call this kind of sample the iid sample."
],
[
208.1,
"That basically means each draw is independently"
],
[
211.7,
"and identically distributed from the population truth."
],
[
216.2,
"So if that's the case, the covariance term is going to disappear,"
],
[
220.3,
"and you're only left with the variance term."
],
[
222.8,
"And again, each observation is iid."
],
[
228.2,
"Each observation is going to be representative"
],
[
230.5,
"of the true population, and the variance is going"
],
[
233.2,
"to be the same as true population variance."
],
[
236.5,
"So we're going to get 1 divided by n squared times n times the sigma x"
],
[
242.8,
"squared, which is equal to sigma x squared divided by n."
],
[
248.4,
"And this is very nice as well, because we have the n in the denominator."
],
[
252.8,
"What does that mean?"
],
[
254.3,
"That means if we increase the sample size,"
],
[
256.9,
"that if n gets bigger and bigger, the variance of x bar is going"
],
[
261.1,
"to be smaller and smaller."
],
[
263.5,
"And eventually, if we send n to infinity,"
],
[
267.1,
"the denominator is going to go to infinity."
],
[
269.4,
"And the whole thing, the variance of x bar,"
],
[
272.1,
"the variance of the sample mean estimator,"
],
[
274.8,
"is going to converge to 0."
],
[
278.3,
"So what does that mean to have a random variable with variance close to 0?"
],
[
283.8,
"That means the random variable is going"
],
[
285.8,
"to be very concentrated around its mean."
],
[
289.4,
"So that means when n is big, the x bar, the sample mean estimator"
],
[
295.0,
"we just constructed, is going to be closer to the true population mean"
],
[
300.2,
"when we have a larger sample size."
],
[
303.6,
"This is also pretty nice."
]
],
"se": [
[
0.5,
"Now we have the variance of the sample mean estimator."
],
[
3.8,
"We can also calculate the standard deviation"
],
[
6.6,
"of the sample mean estimator."
],
[
8.5,
"And we have a new term, which is called a standard error."
],
[
11.9,
"Now what is a standard error?"
],
[
13.2,
"Standard error is a standard deviation of a sample mean,"
],
[
17.0,
"or more broadly, an estimator."
],
[
19.7,
"When you have an estimate, you say the estimate is a random variable."
],
[
24.9,
"So it's going to have the variance and also a standard deviation."
],
[
30.2,
"A standard deviation of an estimate is sometimes"
],
[
32.7,
"called the standard error."
],
[
35.0,
"Now the way to calculate the standard error is pretty easy."
],
[
38.0,
"The standard error of the sample mean estimate"
],
[
40.8,
"is just the square root of the variance of the sample mean estimate."
],
[
45.4,
"So it's going to be the variance of the sigma x squared divided by n."
],
[
50.1,
"And they're going to get this term, the sigma x divided"
],
[
53.8,
"by the square root of it."
],
[
57.3,
"Now you can also simplify the notation."
],
[
59.3,
"You're going to get this, the sigma x bar, which is a standard error"
],
[
63.5,
"of the sample mean estimate, is going to equal to the sigma x,"
],
[
68.0,
"which is the standard deviation of the underlying population,"
],
[
72.3,
"divided by the square root of n."
],
[
74.9,
"Now do you understand why the sigma x bar is smaller than sigma x?"
],
[
81.6,
"I'll give you a few seconds to think about that."
],
[
85.5,
"OK, so the answer is that those are two different things."
],
[
89.6,
"And the sigma x is the standard deviation of one unique draw"
],
[
95.2,
"from the population."
],
[
96.2,
"It's each observation, each observation in the population,"
],
[
100.0,
"what is standard deviation."
],
[
102.4,
"Now the x bar, this is the sigma x bar instead,"
],
[
105.3,
"is a standard deviation of the sample mean estimates."
],
[
108.4,
"So those are two different concepts."
],
[
111.2,
"Now the fact that the x bar is going"
],
[
114.0,
"to be the average of the sample mean,"
],
[
119.7,
"which is going to be the average of n observations,"
],
[
124.4,
"it's going to have a smaller standard deviation"
],
[
128.0,
"than any one observation from the population."
],
[
132.1,
"So intuitively, that's why the sigma x bar is smaller than sigma x."
],
[
137.2,
"It can also show you that's the case"
],
[
139.0,
"by looking into the example by a case study."
]
],
"two-coins": [
[
1.3,
"Now suppose we're flipping an unfair coin"
],
[
4.8,
"with the p equal to 0.66 or 2 thirds of landing head."
],
[
10.5,
"The coin has 0.66 probability of landing head"
],
[
14.1,
"and 0.34 probability of landing tail."
],
[
18.0,
"In principle, you could calculate the standard deviation"
],
[
22.6,
"of the underlying population."
],
[
25.1,
"It's basically the outcome p, or the outcome of the coin,"
],
[
31.9,
"follows a binary distribution, a Bernoulli distribution."
],
[
38.8,
"Now what is the standard deviation or the distribution"
],
[
41.4,
"of the sample mean estimator?"
],
[
43.9,
"Now it depends on the sample size."
],
[
45.8,
"So if we flip this coin twice, or five times,"
],
[
49.2,
"or 25 times, or 100 times, let's take a look one by one."
],
[
53.3,
"So if we flip the coin only two times,"
],
[
57.5,
"we have a sample mean estimator."
],
[
60.1,
"Now in this particular case, we can actually very easily"
],
[
62.8,
"write down the distribution of the sample mean estimator."
],
[
66.5,
"So what's the distribution of the sample mean estimator,"
],
[
72.2,
"which is a random variable, when the sample size equals 2?"
],
[
77.9,
"I can calculate what's the probability of tail twice,"
],
[
81.4,
"which basically says x bar equal to 0."
],
[
84.2,
"That means we have tail once and tail twice."
],
[
86.9,
"It's going to p0 times p0, and you're going to get 0.115."
],
[
91.1,
"And you assign the probability to the bar, x equal to 0."
],
[
95.6,
"And the height of that bar is 0.115."
],
[
98.9,
"Similarly, you can compute the probability of head and tail,"
],
[
102.5,
"which leads to x bar equal to 0.5, which is essentially 2 times p0 times p1."
],
[
109.5,
"So you can either get the head the first time, tail the second time,"
],
[
113.7,
"or the head second time and tail first time."
],
[
116.5,
"We calculate the p0, p1 plus p1, p0."
],
[
119.7,
"That is 2 times p0, p1."
],
[
122.2,
"And you're going to get 0.449."
],
[
124.6,
"And that is the height of the middle bar, the bar when x equals to 0.5."
],
[
131.0,
"And lastly, you can calculate the probability"
],
[
133.4,
"head twice, which is the probability of 1 times probability of 1,"
],
[
137.4,
"which is going to give you 0.436."
],
[
140.1,
"And that's the height of the third bar."
],
[
144.4,
"So now what's interesting is that you know the distribution,"
],
[
148.0,
"the expected value of e of x bar is going to be at 0.66 somewhere here."
],
[
155.3,
"But if you only flip the coin twice, you construct a sample of size 2."
],
[
161.0,
"And you can see the distribution of that particular random variable, x bar."
],
[
166.1,
"The expected value of that random variable is going to be the ground truth."
],
[
170.5,
"But if you only flip it twice, you're only likely to get three outcomes."
],
[
175.2,
"Either x bar is equal to 0 or x bar equal to 0.5 or x bar equal to 1."
],
[
180.4,
"In none of those cases, you're going to converge to the true expected value of x bar,"
],
[
185.8,
"which is 0.66."
],
[
188.6,
"But you're still able to reduce the variation."
],
[
193.5,
"Now, if you flip the coin five times, you can do the same exercise."
],
[
198.7,
"Calculate the distribution of the random variable x bar by n equals to 5"
],
[
203.1,
"is going to look like this."
],
[
204.8,
"So you can see the expected value is still 0.66 somewhere here."
],
[
212.3,
"Now, you can clearly see, although the mean is still the same,"
],
[
216.3,
"if you calculate the mean of this random variable by n equals to 5,"
],
[
219.5,
"it's still going to be here."
],
[
221.4,
"But you can see it's less dispersed, right?"
],
[
223.8,
"It's a lot more concentrated around the mean."
],
[
226.2,
"So you have two bars that are pretty close to the mean compared to when n equals to 2."
],
[
230.5,
"But you have bars that are pretty far from the mean."
],
[
233.8,
"And then a miracle happens when n becomes bigger and bigger."
],
[
237.7,
"Now, see when n equals to 100, not only on the average, we get 0.66."
],
[
243.6,
"Ground truth, we're going to get that."
],
[
246.0,
"And also, the distribution is going to be super close to the truth, 0.66."
]
],
"lln": [
[
0.4,
"So this leads to a very important concept called law of large numbers."
],
[
9.4,
"I'm not going to prove that, but the law of large numbers basically tells us"
],
[
13.5,
"as n becomes bigger and bigger and we construct a sample to infinity,"
],
[
18.5,
"the x bar is going to converge to the true expected value of x."
],
[
24.2,
"As you can imagine, if we increase the sample size, if n goes to 100, not 100, but 1,000,"
],
[
30.0,
"we're going to see something like this."
],
[
31.5,
"And eventually, the whole distribution is going to collapse to a single point."
],
[
37.5,
"And then that is a very important concept called law of large numbers."
],
[
47.2,
"It tells us when, as long as we increase the sample size big enough and as long as our sample"
],
[
52.7,
"is representative, eventually, the sample analog is going to converge to the true population."
],
[
60.1,
"So that is the theory that connects what we observe in the sample to the population."
],
[
67.6,
"So it gives the meaning to the sampling process."
],
[
71.1,
"Now, we could use the sample to learn the ground truth."
],
[
75.1,
"That's a huge step and that's a miracle of statistics."
]
],
"clt": [
[
0.6,
"And there's one more, which is called the central limit theorem."
],
[
5.3,
"Another thing that's very, very fancy is that if you take a look at the distribution and gets bigger and bigger,"
],
[
14.3,
"the sample means that the sample means that it is going to follow the normal distribution."
],
[
24.2,
"So that's a very fun thing, which is when any small distribution still inherits the discreteness in the underlying population."
],
[
34.1,
"Because in the underlying population, the coin flip can only take two values, either one or zero."
],
[
40.3,
"But when it gets bigger and bigger, the sample mean estimator is going to look a little bit more continuous."
],
[
50.1,
"And eventually, it's going to look pretty bell-shaped."
],
[
54.0,
"It looks pretty normal."
],
[
56.0,
"And the central limit theorem actually states that when n is large, indeed, the x-bar, the sample average estimator,"
],
[
64.0,
"is going to be approximately a standard normal distribution."
],
[
68.1,
"Sorry, to be more precise, the x-bar is going to follow the normal distribution,"
],
[
75.1,
"with mean as mu of x and the standard error, or the variance, the sigma x-bar squared."
],
[
84.1,
"So we know the property of the standard normal distribution."
],
[
87.1,
"We can always subtract a random variable that follows the normal distribution."
],
[
93.1,
"We subtract the mean, divide it by the standard deviation, and that random variable is going to follow N(0, 1),"
],
[
102.1,
"the standard normal distribution."
],
[
104.1,
"So we actually use this graph to show you if it is indeed the case."
],
[
109.6,
"When you have n equals to 2, if we do this standardization of the transformation,"
],
[
114.6,
"you see the three bars, it looks like this."
],
[
117.6,
"It means it's not super normal."
],
[
119.6,
"I have layout the standard normal distribution on top."
],
[
123.6,
"It doesn't look super normal distributed."
],
[
126.6,
"But if you increase n of n equals to 5, it looks slightly more normal after the standardization."
],
[
131.6,
"When you have n equals to 100, you see the blue bar almost perfectly align with the red curve."
],
[
137.6,
"So you can see when n equals to 100, after doing the transformation, it already looks super normal."
],
[
144.6,
"So this is a very strong result."
],
[
149.6,
"I'm not going to prove the result for you."
],
[
152.6,
"It's going to be at the PhD level."
],
[
154.6,
"And it turns out to be a super strong result."
],
[
156.6,
"Because not only can we say, from the law of flush number,"
],
[
160.6,
"that when we send n to infinity, the x-bar is going to converge the expected value of x, the ground truth."
],
[
167.6,
"But also, central limit theorem tells us we can actually approximate the speed of that convergence."
],
[
174.6,
"Or we're able to approximate what the distribution looks like."
],
[
179.6,
"We can not only say the expected value, but we're also able to say the exact distribution when n gets bigger."
],
[
187.6,
"That's a very, very important fact."
],
[
190.6,
"It's called the central limit theorem."
],
[
192.6,
"That is when n approaches infinity, the sample mean estimator is going to follow the normal distribution."
],
[
200.6,
"In statistics, sometimes people say this is asymptotic."
],
[
205.6,
"It's not asymptom, which is a very common word people use during the COVID."
],
[
213.5,
"This looks like asymptom, but it's actually different."
],
[
217.5,
"Asymptotic means, essentially, we send n to infinity."
],
[
221.5,
"We observe infinite amount of data, or we construct a sample that is of infinite size."
],
[
227.5,
"So the idea we can send n to infinity is called asymptotic theory, or asymptotic property."
],
[
234.5,
"So now we're saying if we send n to infinity, the sample mean estimator is going to asymptotically follow the normal distribution."
],
[
242.5,
"So that's a central limit theorem."
],
[
246.5,
"Roughly speaking, the central limit theorem states that the average from a random sample for any population with finite variance will be approximately normally distributed for large enough samples."
],
[
260.5,
"It's a strong result because it doesn't put any restrictions of the underlying population."
],
[
266.5,
"In the previous example, we know the underlying population, probably a variable may follow the Bernoulli distribution, which has nothing to do with the normal distribution."
],
[
276.5,
"Now, if we construct a sample, and we calculate the sample mean estimator, and if we send n to infinity, meaning we construct a bigger and bigger and potentially infinitely bigger sample,"
],
[
292.5,
"the sample, we get the sample mean estimator, the sample mean estimator is going to follow the normal distribution."
],
[
298.5,
"Although, each individual observation is not following normal at all."
],
[
304.5,
"So this also tells us why normal distribution is so important, why we spent such a long time discussing the normal distribution previously,"
],
[
313.5,
"because the central limit theorem tells us in statistics, if you have something that resembles the sample mean estimator,"
],
[
322.5,
"meaning you have construct a sum of a lot of things and divided by the sample size,"
],
[
328.5,
"that estimator under the central limit theorem is going to follow normal distribution."
],
[
334.5,
"So that's why the normal is kind of a super important distribution in real life."
],
[
340.5,
"Now, why should we care about normal distribution? How does it help us understand statistics?"
],
[
346.5,
"It turns out the normal distribution helps us to do several things."
],
[
350.5,
"It allows us to compute margins of the error for our estimates."
],
[
354.5,
"It also allows us to test hypotheses about parameters."
],
[
358.5,
"So in some sense, once we have a sample, we construct the sample mean estimator, we get a point estimate."
],
[
367.5,
"Sometimes we are happy with the point estimate, sometimes we are not."
],
[
371.5,
"Because in real life, like when you need to make a decision as a manager,"
],
[
376.5,
"they're not only interested in the point estimate itself,"
],
[
379.5,
"they're also interested in how confident we are about the point estimate."
],
[
384.5,
"Right, you might actually run a advertising campaign that shows a positive X bar,"
],
[
391.5,
"meaning potentially the campaign is going to increase the revenue of the company by say $10,000."
],
[
397.5,
"But it's also important for our decision process is how confident we are about that number, about that $10,000."
],
[
405.5,
"Do we mean that it's likely to have minus 20 all the way to positive 40?"
],
[
411.5,
"So on average, we have $10,000."
],
[
413.5,
"Or does it mean possible to have $9,000 or $11,000?"
],
[
418.5,
"So on average, we get $10,000."
],
[
420.5,
"So in those two different cases, that might lead to entirely different decision process."
],
[
427.5,
"So we want to use the central limit theorem to be able to say something about how confident we are"
],
[
436.5,
"or how precise the estimate is."
],
[
439.5,
"So that's a goal of constructing or of using the central limit theorem."
]
],
"properties": [
[
0.5,
"So before we show you the example of doing that, I want to say briefly about some desirable properties of estimators."
],
[
7.5,
"So in some sense, we construct a sample mean estimator, which is intuitive."
],
[
13.5,
"But it's just one way of constructing the sample mean estimator."
],
[
17.5,
"You can have like a lot of different estimators that can be used to estimate the population average."
],
[
24.5,
"Somebody might come up with something like X tilde, which is the average of the first two observations."
],
[
34.5,
"It's also an estimator."
],
[
36.5,
"But if we want to disentangle which is a better estimator, whether we want to use X bar or X tilde,"
],
[
43.5,
"we have to define some desirable properties of estimators."
],
[
47.5,
"And then we can see whether the X bar or X tilde satisfy each of those desirable properties or not."
],
[
53.5,
"So we are able to say which one is a better estimator."
],
[
57.5,
"Now intuitively, there are several things we would like our properties of our estimators to have."
],
[
63.5,
"The first property is that we want the estimator to be correct on average."
],
[
68.5,
"The estimator should be centered around the truth."
],
[
71.5,
"In this example, the sample mean estimator should be centered around the true population mean."
],
[
76.5,
"Second, we want the estimator to get closer to the truth as our sample size increases."
],
[
84.5,
"We want what we send into infinity."
],
[
86.5,
"Eventually, it's going to be correct."
],
[
89.5,
"And lastly, we want to have a convenient sampling distribution."
],
[
94.5,
"We want our sample to be, say, normally distributed."
],
[
98.5,
"We have seen the sample mean estimator, shown here, have all those properties."
],
[
104.5,
"So what about the X tilde?"
],
[
106.5,
"Now the X tilde is actually has the first, specify the first property,"
],
[
111.5,
"and the expected value of the X tilde is going to be the ground truth."
],
[
115.5,
"So it's still correct on average."
],
[
118.5,
"But it's not going to be correct eventually."
],
[
121.5,
"The reason is that this estimator, X tilde, only uses the first two observations, regardless of the sample size."
],
[
128.5,
"So even if we send into infinity, this estimator is not going to get to the correct truth eventually."
],
[
136.5,
"But the X bar is going to, because X bar uses all the information in our sample."
],
[
141.5,
"Now, in some sense, this X tilde is a pretty stupid example, because there's no reason why we only use the first two observations in the sample."
],
[
150.5,
"But for illustration purposes, you can see that X tilde satisfies the first property, but it doesn't satisfy the second two properties."
],
[
159.5,
"Because we couldn't use law of large numbers or the central limit theorem on the second estimator,"
],
[
164.5,
"because it only utilizes the first two observations."
],
[
169.5,
"Now, to put it slightly more formally, there are several desirable properties of estimators."
],
[
174.5,
"Can we say the estimator is unbiased if it's central around the truth?"
],
[
179.5,
"We see the estimator is consistent if the estimate is going to approach eventually to the ground truth."
],
[
186.5,
"And we see the estimate is asymptotically normal if the estimate, after subtract the mean, divided by its own"
],
[
196.5,
"standard deviation, it's going to follow the standard normal distribution."
],
[
199.5,
"And we have just shown that the sample mean estimator actually has all these properties."
],
[
206.5,
"We are going to later on establish these properties for each of the estimators we propose in this class."
],
[
213.5,
"So ideally, we would like the estimator to have all the three good properties."
],
[
218.5,
"Unbiasedness, the consistency, and asymptotic normality."
]
],
"ci-idea": [
[
0.5,
"Now, to go back to the question we had before."
],
[
6.5,
"Why do we want to construct a confidence interval, the or the standard normal distribution?"
],
[
14.5,
"What does the central limit theorem help us?"
],
[
17.5,
"Central limit theorem gives us something on top of the point estimate x bar."
],
[
22.5,
"So it helps us to be able to see how precise we are in terms of these x bar estimates."
],
[
29.5,
"Once we know it's going to follow the standard normal distribution, or the x bar itself is going to follow the normal distribution,"
],
[
36.5,
"we are able to say that the estimate accompanied by an estimate of the error that it might be involved."
],
[
49.9,
"So we can write down that mu of x is going to be equal to the point x bar plus or minus some errors."
],
[
56.9,
"Or equivalently, we can say that the ground truth mu of x is going to be bounded by the x bar minus an error and x bar plus an error."
],
[
66.9,
"So something I might eventually want myself to say is, I conducted a study to estimate something about the population."
],
[
76.7,
"My estimate is some value."
],
[
78.7,
"The way I went about making this estimate, I had a certain chance of ending up with an estimate with some small amount of the truth."
],
[
89.7,
"So to give you a more concrete example, I want to say something like, I conducted a study to estimate the average price per gallon of gasoline last week in the Greater Rochester region."
],
[
100.7,
"My estimate is $3.3 per gallon."
],
[
103.7,
"The way I went about making this estimate, I had a 95% chance of ending up with an estimate with .36 of the truth."
],
[
113.7,
"So in other words, I'm 95% sure the price of gas per gallon in the Greater Rochester region is going to be 3.3 minus 0.36 to 3.3 plus 0.36."
],
[
130.7,
"Now the question is, how do I ensure the statement like this is actually a valid statement?"
]
],
"interval": [
[
0.7,
"Now let's move on to the interval estimates."
],
[
4.9,
"So to reframe what I just said, the statement I make is basically the ground truth of the gas price in the Greater Rochester region last week."
],
[
13.9,
"Between the X bar minus an error to the X bar plus an error, I claim the probability this thing occur is 0.95."
],
[
24.9,
"So that is essentially the equivalent statement I have made before."
],
[
29.9,
"Previously, I made the statement in plain English."
],
[
33.9,
"Here, I transfer the statement, converge the statement into the probability of mathematical language."
],
[
39.9,
"One question you might have is that, why do I have 0.95 on the right-hand side instead of 1?"
],
[
46.9,
"In some cases, we want to make an argument that for sure the price is going to be between some numbers, to some numbers."
],
[
54.9,
"And the reason is that, if I want to make a statement that something is for sure going to happen, it's not going to be very interesting."
],
[
63.9,
"And the reason is that, because mu of X is a random variable, it can be a lot of things, can be potentially infinite amount of things."
],
[
72.9,
"If I want to for sure bound that mu of X, it's not going to be an interesting argument at all."
],
[
79.9,
"It's likely to be, I only know that the value of the gas is going to be between 0 to infinity."
],
[
86.9,
"That is, the probability of that thing happening is going to be equal to 1."
],
[
89.9,
"That's a pretty boring argument."
],
[
91.9,
"So in order to make the argument more interesting, we're going to bound it to some big number, but not 1."
],
[
98.9,
"We might do 0.95, sometimes we do 0.9 or 0.99."
],
[
104.9,
"Now how do we do that?"
]
],
"normal": [
[
0.9,
"So we're going to utilize the property of standard normal distribution."
],
[
5.9,
"Now let's plot with a very closely related exercise."
],
[
9.9,
"Now if we want to find an interval that contains a random draw from a standard normal distribution, 95% of the time."
],
[
16.9,
"So if you know the rule of thumb from the standard normal distribution, you can plot the standard normal distribution here."
],
[
22.9,
"And you can find density from a region, say this region."
],
[
31.9,
"You want to make sure the density of the PDF function of the standard normal distribution, the density within those range, is going to account for 95% of the total density."
],
[
44.9,
"Basically, it says that the likelihood of the value between those two bounds is going to be equal to 0.95."
],
[
56.9,
"Now from the rule of thumb of normal distribution, we actually know what those two cutoffs are."
],
[
62.9,
"The cutoff is minus 1.96 to positive 1.96."
],
[
68.9,
"So this is the property from the standard normal distribution, which is there's a 95% chance that a random variable z will fall in the interval minus 1.96 to positive 1.96."
],
[
81.9,
"And this is going to be the tightest guess."
]
],
"ci-build": [
[
0.9,
"Now we go back to our old question."
],
[
4.5,
"So the central limit theorem actually tells us something about our best guess, our point estimate x bar."
],
[
11.5,
"What we know is that the x bar subtract the mean divided by the sample standard deviation is going to approximately standard normal distribution."
],
[
21.5,
"So we know essentially this thing is standard normal distributed."
],
[
28.5,
"We know it's a random variable that follows standard normal distribution."
],
[
33.5,
"Then we know if some random variable follows standard normal distribution, the probability that variable takes the value between minus 1.96 to positive 1.96 is going to be 0.95."
],
[
45.5,
"We just established that property with a standard normal distribution."
],
[
50.5,
"So we have this math term."
],
[
53.5,
"I'm going to rewrite this math term here."
],
[
55.5,
"I just copy here."
],
[
58.5,
"And we'll do some mathematical things."
],
[
61.5,
"First, we're going to rearranging by multiplying the denominator on both left-hand side and right-hand side."
],
[
67.5,
"You're going to get this."
],
[
69.5,
"And you're going to move the x bar to the left-hand side and x bar to the right-hand side."
],
[
78.5,
"You're going to get the second line."
],
[
80.5,
"So now you have the mean of x in the center."
],
[
83.5,
"And the mean of x is the population mean."
],
[
85.5,
"It's the ground truth."
],
[
87.5,
"And you have on the two sides the x bar minus 1.96 times the standard error."
],
[
100.7,
"On the right-hand side, x bar plus 1.96 times the standard error."
],
[
105.7,
"It's exactly 0.95."
],
[
112.7,
"So we can say that 95% confidence interval for mu x is going to be x bar plus minus 1.96 times the standard error of the sample mean estimate."
],
[
124.7,
"Notice that the interval is going to get tighter and tighter as n approaches infinity."
],
[
129.7,
"And if n approaches infinity, this term is going to go to 0."
],
[
134.7,
"And the interval is going to collapse to the x bar."
],
[
138.7,
"And this is how we construct a confidence interval."
],
[
144.8,
"There's only one last thing I want to say."
],
[
146.8,
"In the previous slides, we assume we actually know the true value, sigma of x."
],
[
151.8,
"We can construct a standard deviation."
],
[
154.8,
"In reality, probably we don't know sigma of x."
],
[
157.8,
"So what we're going to do is to replace the population standard deviation with our best estimate,"
],
[
163.8,
"which is going to be the sample estimate of the standard deviation of the population, which is going to be s of x."
],
[
171.8,
"So instead of using the population standard deviation, which is unobserved to us,"
],
[
179.8,
"everything about the population is unobserved to the researcher,"
],
[
183.8,
"we're going to use a sample analog of the population standard deviation or the sample standard deviation."
],
[
189.8,
"We're going to use s of x to plug in s of x to represent the sigma x."
],
[
197.8,
"So now you have the final term, which is feasible to do,"
],
[
204.9,
"because everything on the right-hand side in the bracket is what we can directly learn from the sample."
],
[
210.9,
"x bar, sample mean estimate, the sigma square root of n, the sample size,"
],
[
216.9,
"s of x, the sample standard deviation estimate."
],
[
221.9,
"So by this formula, not only can we say the point estimate assigned to the central limit theorem,"
],
[
228.9,
"we know the estimation that sample mean estimates follows,"
],
[
231.9,
"which is the standard normal distribution when n goes to infinity."
],
[
236.9,
"So we are able to write down the set, the 95% confidence set or confidence interval related to that point estimate."
],
[
246.9,
"So sort of the way we should interpret this confidence interval is that I'm 95% sure the population mean is going to lie within this confidence interval."
],
[
258.9,
"Now suppose we want to construct a 99% confidence interval,"
],
[
264.9,
"right?"
],
[
265.9,
"They're going to have a bigger critical value."
],
[
268.9,
"Previously, the cutoff is 1.96."
],
[
271.9,
"If you want to have a more precise, more confident, bigger 99% confidence interval,"
],
[
278.9,
"the confidence interval itself is going to get wider and wider."
],
[
282.9,
"So intuitively you can think about this as if you want to throw basketball into the basket,"
],
[
288.9,
"into the basket, if my ability is the same, if I want to throw the basket into the basket 95% of the time."
],
[
297.9,
"Now, if I want to make sure I'm going to throw the basketball into the basket 99% of the time."
],
[
303.9,
"And if I want to fix my ability, the only thing I can do is to increase the size of a basket."
],
[
310.9,
"So the same logic here, right?"
],
[
312.9,
"If you want to construct a 99% of confidence interval,"
],
[
315.9,
"you have to enlarge the basket size,"
],
[
318.9,
"you have to enlarge the size of the confidence interval."
],
[
322.9,
"Okay."
]
],
"election": [
[
0.9,
"So one reason why the confidence interval is useful in our real life"
],
[
6.9,
"is that it helps us understand a lot of things in real life."
],
[
10.9,
"For example, the election outcomes."
],
[
13.9,
"So back in 2016, many people were quite surprised by the election outcomes,"
],
[
20.9,
"which was basically Donald Trump won that election."
],
[
23.9,
"But people were surprised because the poll or the surveys"
],
[
28.9,
"shows that Clinton has a much better chance of winning than Trump."
],
[
33.9,
"So we take a look at the predicted election outcomes"
],
[
38.9,
"right before the election on November 8th, 2016."
],
[
42.9,
"As you see the predicted votes, Clinton is going to get, Hillary is going to get 302."
],
[
47.9,
"Trump is going to get 235."
],
[
52.9,
"Clearly, that's quite different."
],
[
54.9,
"You might think from the point estimates, Hillary has a much bigger chance than Trump."
],
[
59.9,
"But it turns out, if you take a look at the confidence interval,"
],
[
63.9,
"as confidence interval is given by the light blue and light red region,"
],
[
67.9,
"you can see the confidence interval sort of entirely overlap with each other."
],
[
73.9,
"So in some sense, although the point estimates shows Hillary Clinton has a better chance,"
],
[
78.9,
"the confidence interval tells us we are actually not confident about that outcome at all."
],
[
84.9,
"Actually, it's a pretty imprecise estimate."
],
[
87.9,
"Hillary's predicted to win something around, I don't know, like 200 to 300 to 400."
],
[
94.9,
"Everything between 200 to 300 seems possible outcome."
],
[
98.9,
"And also, if you take a look at the legend, for whatever reasons,"
],
[
104.9,
"the website actually reports an 80% chance of falling in this range."
],
[
110.9,
"It's the 80% confidence interval."
],
[
112.9,
"It's not the confidence interval people would usually use."
],
[
115.9,
"People would usually do something like 90% or 95%."
],
[
119.9,
"And you can imagine if we do 90%, right, the confidence interval is going to get even larger."
],
[
124.9,
"You're going to see even more overlapping confidence interval."
],
[
128.9,
"In that sense, if you understand statistics and you went back to read the polls of the 2016 election,"
],
[
138.9,
"you won't be super surprised by the outcome."
],
[
141.9,
"I mean, there are certain other reasons."
],
[
143.9,
"People complained about the survey, something like representativeness."
],
[
147.9,
"But at the end of the day, if you take the confidence interval pretty seriously,"
],
[
151.9,
"if you understand the statistics behind the confidence interval,"
],
[
156.9,
"that you are able to understand those statistics much better."
],
[
163.9,
"You're going to integrate the outcomes in a much better way than most people would do."
]
]
};
