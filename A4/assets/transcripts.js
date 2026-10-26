// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
1.7,
"Welcome to this module on propensity scores."
],
[
5.7,
"In the live session on matching, we compare treated and untreated units that look alike on what we observe."
],
[
13.8,
"That works with one or two characteristics. With a hundred, no two units look really alike."
],
[
22.8,
"The propensity score is the way out. It summarizes all the characteristics in a single number, the probability of being treated."
],
[
31.7,
"To estimate that probability, we need a model for yes or no outcome, so we start from there."
],
[
39.4,
"Then we use a score on a real marketing question, which doctor should a drug company's sales representative visit?"
]
],
"how-to": [
[
0.0,
"Again, a quick word on how to use this page. As before, every slide has its own voiceover. You can go at your own pace and the transcript is under each slide. On the try-it slides, you can move a churn model's threshold, pick a bin of the score, change the number of strata or do whatever simulations you like."
]
],
"roadmap": [
[
0.0,
"Part 1 is about binary outcomes, the linear probability model, the logit model and how to read its output."
],
[
8.0,
"Part 2 introduces the sales-rep case and the idea of propensity score."
],
[
14.0,
"Part 3 shows three ways to use the score and how to check that they worked."
],
[
19.0,
"Part 4 runs the case from start to finish and revisits the job training data from the live session."
]
],
"yes-no": [
[
0.8,
"Many business outcomes are yes or no. Will consumers buy? Will a person cancel the contract? Will a certain loan default? Machine learning calls a model for such an outcome a classifier. In statistics, it's a regression with a binary dependent variable. Same thing."
],
[
22.0,
"We care for two reasons. The outcomes are everywhere, and which is why the topic is in this module, and propensity score itself is a model of a yes or no variable. Was this unit treated or not?"
],
[
38.2,
"Our running example is a telecom company with about 7,000 customers, 26% of whom left during the data window."
]
],
"lpm": [
[
0.0,
"The simplest approach is the one we have used all along, OLS, just using 0,1 outcome as a Y variable on the left. That's the so-called linear probability model."
],
[
11.6,
"A coefficient is a change in the probability in percentage points. Each extra month with a company lowers the churn probability by 0.45 points."
],
[
22.4,
"A two-year contract lowers it by 16 points, and fiber-optic internet raises it by 18 points."
],
[
30.4,
"Be careful with the words. Going from 26% to 25.55% is a drop of 0.45 points, but that's 1.7%."
],
[
42.4,
"So always say whether the drop is percentage points or percent."
],
[
46.4,
"The treatment effects, like experiments in the live sessions, the model is exactly right."
],
[
53.4,
"A difference in means of a 0,1 variable is a difference in probabilities."
]
],
"lpm-problems": [
[
0.4,
"But the linear model has two problems when we need actual probabilities."
],
[
4.4,
"The chart shows a predicted churn probability for every customer."
],
[
8.4,
"You see, 17% of them get a negative probability."
],
[
12.4,
"A straight line has no floor or ceiling, so in principle it could predict anything from negative infinity to positive infinity."
],
[
22.4,
"Second, the line gives the same effect everywhere."
],
[
26.4,
"One more month lowers churn by 0.45 percentage points for a customer at 60% risk and for someone at 1% risk."
],
[
36.4,
"So, we might want to use an alternative model."
],
[
42.1,
"You can click logit model to see the alternative."
],
[
46.1,
"Now every prediction stays between 0 and 1."
]
],
"logit": [
[
0.0,
"So what is logit? The logit keeps the linear index, that's beta 0 plus beta 1 times x and so on, but passes it through a S-shaped curve that always stays between 0 and 1."
],
[
16.3,
"There's another model called probit, which uses a slightly different S-shaped function."
],
[
23.4,
"But importantly, the two models give practically the same predictions."
],
[
28.6,
"And both are going to be fitted by the so-called maximum likelihood approach rather than the least squares."
],
[
36.3,
"But in Python, it's pretty simple. It's just one line."
],
[
40.8,
"Now to intuitively understand how logit works, you can try the sliders."
],
[
45.8,
"Pick a starting probability and a change in the index, say a coefficient of 0.8 for receiving a coupon."
],
[
53.9,
"From 10%, the coupon takes the customer to about 20%."
],
[
59.5,
"From 90%, the same coefficient adds only 5 points."
],
[
64.4,
"Now you see the curve is steepest in the middle and pretty flat on both ends, which makes sense."
],
[
70.7,
"Because for a consumer who has almost zero probability of purchasing your product, some small change in attributes is probably not going to convince the consumer."
],
[
81.4,
"And the consumer who is with the middle probability of purchasing your product is probably the most likely to be persuaded."
]
],
"coefs": [
[
0.0,
"Here's the churn model, both ways. The logit coefficient on month is minus 0.033, about 7 times the linear one. It's a change in the index, not a probability. Remember, so you cannot just read it as percentage points."
],
[
15.3,
"To get back to the probabilities, we need to multiply the coefficient by P times 1 minus P, where P is the customer starting probability."
],
[
26.0,
"At 60% probability of purchasing, one more month lowers the churn by 0.8 percentage points. At 5%, that only lowers percentage points by 0.16."
],
[
40.5,
"To report one number, average this effect over all customers. That's so-called the average marginal effect."
],
[
49.3,
"And that's reported in the last column. And for months, it's minus 0.0045. And that number is the same as the linear model."
],
[
59.4,
"For a dummy, predict twice and subtract. A typical month-to-month customer at 26% likelihood, a 26% risk drops to 3% on a two-year contract."
],
[
74.0,
"23 points where the linear model said about 16."
]
],
"threshold": [
[
0.0,
"A logit model gives every customer a probability from almost zero to 80% here. That's what a retention team wants, a ranked list. To turn it into a decision, say who gets a discount offer, you need a threshold. And that's a business choice. That's not a statistic choice. You can move the slider. At 0.5, the model flags 21% of customers and catches about half of the churners."
],
[
25.6,
"At 0.3, it flags 38% and catches about three quarters, but also with more false alarms, which is better depends on what a missed churner costs against a wasted discount. And don't be impressed by accuracy alone, predicting that nobody churns is already 74% accurate."
]
],
"py-logit": [
[
0.2,
"Here's the logit in code. To keep the page light, it uses only NumPy and fits the logit by Newton's method, which is what statsmodels does behind the scenes."
],
[
11.1,
"You can run it and see coefficients and average marginal effects reported from the table and 17% of negative predictions from the linear model."
]
],
"check-1": [
[
0.4,
"Here you can see three questions on part one."
]
],
"sales-rep": [
[
0.0,
"Now let's move on to the main case, from a published study by Rubin and Waterman."
],
[
5.5,
"A large pharmaceutical company markets a prescription drug to about a quarter of a million doctors."
],
[
11.7,
"Its main tool is called Detailing."
],
[
14.0,
"A sales representative visits a doctor, describes a drug, and leaves a sample."
],
[
19.0,
"Every visit is going to cost money."
],
[
20.9,
"For every doctor, the company knows prescriptions in the six months before, whether a representative visited,"
],
[
27.5,
"prescriptions in the six months after, and over a hundred background variables."
],
[
32.8,
"The question is, which doctor who haven't been visited yet should the representative visit next to get the most extra prescriptions per visit?"
],
[
42.6,
"The real data are proprietary, so we use 20,000 simulated doctors that match the published patterns."
],
[
49.7,
"The table shows the first problem, the visited doctors write 22 more prescriptions afterward."
],
[
55.8,
"But they also wrote far more before."
]
],
"company-list": [
[
0.0,
"On the left, prior prescriptions for the two groups. The visited doctors were writing 52% more prescriptions before anyone visited them. On the right is the company's targeting rule."
],
[
12.4,
"It regresses prescriptions after the period on prescriptions before and the background variables, which predicts very well, with R-square about 90%."
],
[
24.4,
"Then it ranks the unvisited doctors by predicted prescriptions and sends the representatives to the top decile list."
],
[
31.4,
"And the marketing VP adds, it works. The doctors we visited last period wrote 9% more prescriptions after the visit than before."
]
],
"pause": [
[
0.0,
"Now pause the video here and think about four questions."
],
[
3.3,
"First, the visited doctors' prescriptions rose 9%. Is that an effect of the visit?"
],
[
9.9,
"Second, they prescribe 52% more before any visit. What has that to do with the comparison afterward?"
],
[
18.1,
"Third, what question does the company's regression answer and what question does the company's need to be answered?"
],
[
24.1,
"And fourth, to know what a visit would do to one particular doctor whom you should compare with."
]
],
"doctors-ab": [
[
0.0,
"Let's take the questions in turn, starting with two doctors."
],
[
3.9,
"Doctor A is a big prescriber, 10 prescriptions before and 15 afterwards, whether a representative visiting or not."
],
[
12.0,
"Her before-after change is plus 5, but the effect of visit is 0. Visiting her is money wasted."
],
[
18.5,
"Doctor B writes one prescription before, left alone she would just write 1 afterwards."
],
[
23.9,
"If visited, she would write 5. The effect of a visit is 4. She is the one worth visiting."
],
[
30.9,
"The causal effect compares the two boxes after, with and without the visit."
],
[
36.1,
"As the study puts it, a causal effect is a change, but not a change in time."
],
[
41.9,
"So the VP's 9% mixes trends and the effects."
],
[
46.3,
"In our data, the unvisited doctor's prescription rose 7% over the same period."
]
],
"ferraris": [
[
0.0,
"Why did the representative visit the busiest doctors? Because they were paid on the total prescriptions of doctors they visited, not on the change they caused."
],
[
9.0,
"The study calls it polishing the Ferraris rather than the Jeeps. The Ferraris keeps winning, polish or not."
],
[
16.0,
"The chart shows that the representatives also favor some specialties. Obstetricians, for example, were rarely visited."
],
[
26.0,
"So the plus 22 is almost entirely selection bias. Because we built the data, we know the true effect on the visited doctor, about 1.5 prescriptions."
],
[
36.0,
"The good news is that this selection on observables, the representatives targeted on variables that are in the data."
],
[
43.0,
"The fix from the live session is matching. Find each visited doctor and match them to an unvisited one."
],
[
50.0,
"But with 100 background variables, no two doctors are alike."
],
[
55.0,
"We need a one number summary."
]
],
"pscore": [
[
0.7,
"That number is exactly the propensity score, the probability that a unit with these certain characteristics is treated, for a doctor the probability of a visit given her prior prescriptions, specialty and everything else."
],
[
16.7,
"Rosenbaum and Rubin proved in 1983 that is enough. If treatment is as good as random once we're conditional on all the X's, it's also as good as random once we're conditional on the score alone."
],
[
29.7,
"A hundred dimensions can be collapsed into one. The second statement is a balancing property. Among units with the same score, treated and untreated have the same distribution of every covariate that went into the score."
],
[
45.7,
"That's one we can check. The intuition here is that if we take all doctors with a score of 30%, each was visited with a probability of 30%."
],
[
55.7,
"So within that group who got visited is like the toss of a coin with a 30% probability."
],
[
62.7,
"So conditional on the propensity score, we are sort of running a little randomized experiment, at least as within the group of people around that certain propensity score."
]
],
"estimate": [
[
0.7,
"Now we don't know the score, so we estimate it with the tool from part one, a logit of treated or not treated as Y on the 100 covariates."
],
[
10.9,
"The predicted probability is the estimated score. Now which covariate? Everything that plausibly drove the treatment decision and predicts the outcome measured before the treatment."
],
[
22.9,
"Past outcomes first and be generous with squares and interactions. The goal is to fit the assignment."
],
[
28.9,
"Now the goal is the score itself is a tool, it's not the model of interest. Nobody wants to report or read the coefficients and if it fits, it's going to be judged by one thing only, which is a balance, which we're going to check in part three."
],
[
42.9,
"In this case, the logit includes things like prior prescriptions, specialty region, years in practice, practice type and HMO share."
],
[
51.9,
"Going from 20 to 80 prior prescriptions multiplies the odds of a visit by about 13."
],
[
58.9,
""
]
],
"design-first": [
[
0.0,
"One rule keeps this approach honest, design before outcomes. The score is estimated from the treatment and covariates only. The comparison group is chosen, trimmed and checked for balance without ever looking at the outcome. The outcome sort of sits there until the design problem is fixed and we are not going to use the outcome."
],
[
21.5,
"Why is this important? An analyst who watches the estimate change with every specification where, consciously or not, stops at the one that the client likes. Balance is the target. It shouldn't involve the answer. It's also how the experiment works. We should first decide who is compared with whom and then compute a simple difference. We shouldn't do it in a reverse engineering way."
]
],
"overlap": [
[
0.0,
"Here's the payoff of having one number. Overlap fits in a single picture."
],
[
6.8,
"These are the estimated scores of the unvisited doctors on top of the visited doctors below."
],
[
13.6,
"The visits sit to the right with an average score of 0.43 against 0.21, but the two groups overlap over most of the range."
],
[
24.8,
"Common support means keeping units whose score lies where both groups have members."
],
[
29.2,
"The simplest rule runs from the larger of the two minimums to the smaller of the two maximums."
],
[
35.2,
"Here is about 0.01 to 0.89."
],
[
38.5,
"That drops 18 visited and 34 unvisited doctors who have no counterpart."
],
[
44.5,
"And the question is going to become to estimate the effects for doctors on that common support."
]
],
"bin-balance": [
[
0.0,
"Here is the balancing property at work. Pick the bin of the score from 0.5 to 0.6. It has 754 visited and 632 unvisited doctors. Overall, the visited wrote 57 prior prescriptions against 37.5. Inside the bin, it's like 67.2 against 67.2. The specialty mix is nearly identical as well."
],
[
25.8,
"You can click through the other bins and compare with all doctors. You can see within every bin, the score did to prior prescriptions and specialty what a coin toss would have done. That's why only knowing the propensity score is quite enough."
]
],
"check-2": [
[
0.2,
"A quick review of three questions on part two."
]
],
"strata": [
[
0.0,
"Now, how do we use the score? The first way to use a score is subclassification. We can cut the score into groups, compare visited and unvisited doctors within each group and average the differences. Weighted by the group size, you get the effect for everyone. Weighted by the number of visited doctors, you get the effect on the visited."
],
[
21.3,
"With one group or one stratum, you have the naive comparison, 22 prescriptions. Now move to five strata. That's the classic choice. The effect on the visited falls to 3.5 against a true 1.55."
],
[
36.7,
"Five strata removed 90% of the bias just as like Cochran's rule of thumb says. What's left comes from the top stratum which spans scores from 0.46 to 0.89. Now you can keep going."
],
[
50.5,
"10 strata gives 2.3, 20 gives 1.9, finer strata mean less bias but also you might get noisier cells."
]
],
"matching": [
[
0.0,
"The second way is again matching. For each visited doctor, find the unvisited doctor with the closest score, usually on the log-odd scale where distances are more even, and average the differences between the pairs. That gives us the effect on the treated. The picture below shows a small sample. Visited doctors on the top, unvisited ones below and a line to each match. Three choices, match with replacement so every treated unit gets its best match, use a caliper which refuses to match."
],
[
30.0,
"matches that are too far away and choose how many neighbors. On all 20,000 doctors, one-to-one matching gives 1.46, 10 closest neighbors gives 1.64, and the true is 1.53. So you can see only five visited doctors are left without match. So either way, the matching method seems to work pretty well."
]
],
"love": [
[
0.0,
"How do we know matching actually works? We can check balance covariate by covariate with a standardized mean difference. The gap between group means divided by the standard deviation. The rule of thumb is to get it below 0.1. This chart is called a Love Plot. Before matching, prior prescriptions are off by 0.9 standard deviations and obstetricians by almost half."
],
[
24.3,
"After matching, every covariate is within 0.03 and after weighting, which comes next within about 0.01. If a covariate stays imbalanced, go back and change the score, for example by adding the square and match again or before looking at the outcome."
]
],
"ipw": [
[
0.0,
"The third way is called weighting. A visited doctor with a score of 0.1 is one of the few visited doctors among doctors like her. She stands in for the other 9, so she gets a weight of 1 over 0.1, which is 10. An unvisited doctor with a score of 0.9 also gets a weight of 10. After re-weighting, each group looks like the whole population, and the weighted means are comparable."
],
[
24.6,
"For the effect on the treated, the visited keep a weight of 1, and unvisited get a score divided by 1 minus the score. That makes the comparison group look like the visited."
],
[
35.4,
"So in this case, if you do the re-weighting, you get 2.84 for the effect on everyone, against a true, 3.05, and 1.72 for the visited, against 1.53, which is a true."
]
],
"dr": [
[
0.0,
"What about the plain regression with all the covariates as controlled as in the live sessions?"
],
[
5.6,
"On the case, it gives 2.14, that's neither the effect on everyone nor the effect of the visited."
],
[
11.1,
"When effects differ across doctors, regression weights are in a way that matches essentially no population we are curious about."
],
[
18.5,
"The better regression approach would be fitting one outcome model for each group, predict both outcomes for everyone, and averages the differences."
],
[
27.0,
"The doubly robust estimator adds weights to do that. It's right if either the outcome model or the score model is right, and give 2.95."
],
[
36.0,
"Now those are some extension models that you could use if you like, but you just need to know their names."
],
[
42.1,
"You don't really need to understand how they work, and they are certainly out of the scope of this course."
]
],
"all-estimators": [
[
0.0,
"Now here are all the estimators on one dataset. We talked about different methods. They are different in terms of the design, but you see they sort of give you somewhat reasonable estimates except the simple difference in means. As we said, the reason is that the simple difference in means would be a mixture of true treatment effect and the selection bias, and in this setting, the selection bias is huge."
]
],
"py-ps": [
[
0.0,
"Now here's how the whole workflow looks like in the code on the 20,000 simulated doctors. You can try to run the codes on your own."
]
],
"check-3": [
[
0.1,
"Here are three questions on part three before we move on."
]
],
"roadmap7": [
[
0.0,
"Part 4, we are going to put everything together. This is the study's roadmap. We can assemble covariates measured before the intervention. We define the intervention. We estimate the propensity score using the logit model. Then we stratify and match or do re-weight, whatever way you like. But importantly, we want to keep the people within the common support."
],
[
24.3,
"Then we check balance, and if it fails, we go back and change the score, find the right clones, and then we can open the envelope and estimate the effect."
],
[
36.5,
"For this case, we have scores from 0.01 to 0.89, 52 doctors dropped because of the lack of overlap, the largest imbalance down from 0.9 to 0.03, and an effect on the visited of about 1.5 prescriptions by matching or by weighting."
],
[
53.0,
"And the naive comparison will give you the wrong answer."
]
],
"deciles": [
[
0.0,
"Now let's move back to the business question, whom to visit next. For each unvisited doctor, her clones, her control among the visited doctors tell us what she would have written if visited."
],
[
13.9,
"Subtracting her own prescriptions gives an estimated effect. Now we can rank unvisited doctors by it and visit from the top."
],
[
22.0,
"Now the chart shows the true effect of a visit by decile of each ranking, which we know because we build the data."
],
[
28.9,
"The company ranking goes the wrong way. Its top decile has a negative effect."
],
[
34.3,
"The causal ranking climbs from 0.3 to 5.6. Prediction ranks the Ferraris. The causal ranking finds the Jeeps."
],
[
44.1,
"Now show the estimates themselves. They run from minus 30 to plus 30."
],
[
48.8,
"Though almost every doctor's true effect lies between minus 5 and 10."
],
[
52.6,
"Sorting on noisy numbers sorts on the noise. The top decile is full of lucky draws or the winner's curse."
],
[
61.3,
"The ranking is right. The extremes are not. The fix is to model the estimated effects on the covariates and targets on that model."
]
],
"lessons": [
[
0.0,
"What does this case teach us? First, prediction is not causal effect estimation. A model that predicts who will buy, churn, or prescribe a lot doesn't tell you whom should you visit, whom should you target a coupon. Targeting on predicted outcomes sends resources to people who would have done it anyway, and that's likely a waste of money. Second, a before-after change is not an effect."
],
[
25.0,
"Third, selection on observables can be plausible when targeting rule was built from recorded variables. And fourth, design first outcome last. And lastly, overlap decides what we can learn."
],
[
38.0,
"The doctors for whom no similar doctors will visit are the ones we couldn't run experiments on and we shouldn't extrapolate to those doctors."
]
],
"lalonde": [
[
0.0,
"Now let's take a look at the job training data from the live class."
],
[
4.1,
"Trainees from a randomized program are compared with men from a national survey."
],
[
9.4,
"And interestingly, we know the experimental answer. That's about $1,800."
],
[
14.3,
"Now the authors tested whether a propensity score could recover the true number."
],
[
19.2,
"On the left, we have 93% of the surveyed men have a score below 0.01."
],
[
24.2,
"They look nothing like the trainees."
],
[
26.2,
"On the right are the estimates. The raw comparison is minus $8,500."
],
[
32.3,
"Stratifying on the score gives about $1,500, 10-neighbor matching $1,600 and weighting about $1,800 close to the experiment."
],
[
41.6,
"One-to-one matching gives $700. It uses only 106 different surveyed men for 185 trainees."
],
[
49.1,
"And a few covariates are still imbalanced if we do one-to-one matching."
],
[
53.4,
"Now switch to the smaller pre-screen comparison group."
],
[
57.0,
"With only 429 men, the estimates are more dispersed."
],
[
63.4,
"That tells us a large control pool plus a score can beat a small hand-picked pool."
],
[
71.4,
"And that's why propensity score can work pretty well, especially when we have a relatively big control group where we can form the probability and find the right clone."
]
],
"untestable": [
[
0.3,
"What can still go wrong? The big thing is that the score balances what we put in it, but not the things we didn't put in it. Perfect balance on 100 covariates says nothing about the 101st. Selections on observable is intrinsically an assumption, and there's nothing we can test whether that assumption holds. There are two things can help. A placebo test estimates the effects on something the treatment cannot have touched. For example,"
],
[
29.9,
"you can estimate the effects on the earnings before the training if you want to test the treatment effect of the training program. On the full survey sample, the placebo effect was minus $1,400, so that design was broken. On the matched sample, you get minus $15. Now passing placebo again doesn't improve a design, but it's gonna make your design much more reassuring. Finally, you can ask, always ask a judgment question. What did the person"
],
[
61.5,
"who assigned the treatment know that the person who assigned the treatment know that it isn't in the data? If there are a lot of things that the person assigned to the treatment know that we don't observe, then we should worry about some selections on unobservable."
]
],
"check-4": [
[
0.6,
"And there are three questions on part four."
]
],
"summary": [
[
0.0,
"Okay, let's wrap up. For yes-no outcomes, the linear probability model reads in percentage points and is fine for average effects."
],
[
8.5,
"The logit keeps probabilities between 0 and 1 and its coefficient must be turned into marginal effects."
],
[
14.6,
"The propensity score is the probability of treatment given the covariates."
],
[
18.8,
"Conditioning on it removes the selection on observables and it balances every covariate used to build it."
],
[
24.8,
"We can use it in three different ways and we should always check the overlap plot before we look at the outcome."
],
[
37.3,
"And lastly, we should remember the limit."
],
[
39.7,
"The assumption of selection on observables is untestable, so report some placebos and sensitivity checks will also be helpful."
]
],
"next": [
[
0.2,
"That is the end of the module, thanks for watching."
]
]
};
