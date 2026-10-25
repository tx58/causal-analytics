// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
0.2,
"Welcome to this module on the potential outcomes framework."
],
[
3.4,
"In the live sessions, we told the causal story with pictures and tables."
],
[
7.4,
"Here we write the same story in math symbols. Why bother? Because every method in the rest of the"
],
[
13.8,
"course, from matching to regression discontinuity to instrumental variables, is an assumption about"
],
[
19.3,
"potential outcomes. Once you can read that language, those methods get much easier."
],
[
25.1,
"We'll go slowly with some examples you can check by hand and the simulation you can play with."
]
],
"how-to": [
[
0.0,
"A quick word on this page. Every slide has its own voiceover. You can go at your own pace or turn to auto-advance. And the transcript is under each slide. Several slides have something you can try. The most important is a table of four units where you can click to decide which gets treated. Please do click. The ideas stick much better if you have broken them yourself."
],
[
21.6,
"One note on notation: I follow Mastering 'Metrics. Other books write y of 1 and y of 0 for the same objects."
]
],
"roadmap": [
[
0.0,
"Four parts. Part 1 defines the potential outcome framework and explains why individual effects can never be observed."
],
[
7.0,
"Part 2 defines the averages we aim for instead and shows what a naive comparison really measures."
],
[
14.0,
"Part 3 shows why random assignments solve the problem and how it connects to regression."
],
[
19.0,
"Part 4 covers the assumption hidden in the notation and gives a map of the rest of the course."
]
],
"program-eval": [
[
0.0,
"Causal questions in business and economics are usually framed as program evaluation."
],
[
5.0,
"There's a treatment, and we want its effect on an outcome."
],
[
9.0,
"Job training and earnings, advertising on purchases, a price change on demand, a grace period on loan default."
],
[
17.0,
"In every case, we compare two outcomes for the same unit, with treatment and without it."
],
[
23.0,
"We stick to binary treatment, treated or not, everything else follows the same logic."
],
[
28.0,
"Notice that each question is about the decision someone could actually make."
],
[
33.0,
"Run the program or not, change the price or not."
],
[
36.0,
"That's what it makes a causal question rather than a prediction question."
]
],
"rcm": [
[
0.2,
"Our framework is the Rubin causal model, after the statistician Donald Rubin."
],
[
6.1,
"It has three ingredients. First, potential outcomes. A causal effect compares two potential"
],
[
11.9,
"outcomes of the same unit. Second, multiple units. Since we never see both outcomes of one unit,"
],
[
19.0,
"other units must stand in for the missing one. Third, the assignment mechanism. How treatment"
],
[
24.8,
"was assigned, decide whether those stand-ins are any good. Keep the third one in mind. Most of this"
],
[
31.2,
"course is about what to do when an assignment was not random. You already met the first ingredient"
],
[
37.9,
"in class, with the two versions of the same customer. The module does all three carefully."
]
],
"notation": [
[
0.0,
"Now the notation. Di is 1 if unit i is treated and 0 if not. Each unit has two potential outcomes. Y1i is the outcome if it gets treated. Y0i the outcome if not. The key word is would. Both numbers exist before we know who gets treated. Then Yi is the one outcome we actually observe."
],
[
28.6,
"For example, a store running a promotion. Y1i is the sales with a promotion. Y0i is the sales without a promotion. Both numbers make sense and exist for every store. The treatment doesn't create those two outcomes. The treatment only decides which one we actually observe in this universe. It never decides what's going to happen in the parallel universe."
],
[
55.8,
"So you can think about potential outcomes as attributes of the unit, like its size or its location."
]
],
"switching": [
[
0.4,
"The causal effect on unit i is the difference between its two potential outcomes. We call it tau i."
],
[
8.4,
"The switching equation links what exists to what we see. If the unit is treated, we see y1, otherwise y0."
],
[
17.4,
"Everything in this module is a rewriting of this one equation, a useful form."
],
[
23.4,
"The observed outcome equals the untreated outcome, plus the effect if the unit is treated."
],
[
29.4,
"For a store, tau i is how much the promotion would raise that store's sales."
],
[
36.4,
"Every store can have a different tau i. Nothing in the framework assumes that the effect needs to be the same for everybody."
]
],
"fundamental": [
[
0.1,
"Here's a central difficulty, or the fundamental problem of causal inference."
],
[
5.5,
"For any unit, we see y1 or y0, but we never see both."
],
[
11.9,
"So tau i can never be computed from the data. So that's not a data problem."
],
[
17.6,
"Even if we have infinite data, that won't fix the problem."
],
[
22.2,
"We have two ways out. The scientific solution assumes everyone responds the same way."
],
[
28.9,
"That works in chemistry, but not really for human beings."
],
[
33.0,
"The statistics solution gives up on individual effects, but aims for averages over many units."
],
[
40.4,
"That is our route. That assumption makes causal inference a missing data problem."
],
[
47.1,
"Half of the potential outcomes are missing by construction,"
],
[
50.4,
"and which half is missing depends on who got treated or the treatment assignment."
]
],
"four-exist": [
[
0.0,
"To make this idea concrete, here are just four units, and for now we have the God's view."
],
[
6.8,
"We observe both potential outcomes for everyone, which is not going to happen in the real world."
],
[
13.0,
"Unit 1's effect is 3."
],
[
16.0,
"Units 2 and 4 have no effect."
],
[
19.7,
"Unit 3's effect is 1."
],
[
21.5,
"You can see that from the tau i in the table."
],
[
24.5,
"So the average treatment effect, the average effect is 3 plus 0 plus 1 plus 0, then divide it by 4 because we have 4 units."
],
[
34.6,
"So the average effect is going to be 1."
],
[
37.4,
"That's the number we like to know."
],
[
40.3,
"Now this example is tiny on purpose."
],
[
42.6,
"You can check every average in your head."
],
[
45.9,
"Now notice how different the units are."
],
[
48.3,
"You can see unit 1 responds to the treatment quite strongly."
],
[
52.8,
"You can see the two units, 2 and 4, who don't respond at all."
],
[
57.1,
"So that kind of heterogeneity is pretty normal in the real data."
],
[
60.8,
"And our framework can easily handle that problem."
]
],
"four-see": [
[
0.0,
"Now the real world. Unit 1 and 2 are treated. Unit 3 and 4 are not. Let's call this assignment A."
],
[
10.0,
"For the treated, we see y1. For the untreated, y0. So we observe 3, 1, 0 and 1. Everything else is a question mark."
],
[
22.0,
"And we cannot compute a single individual effect from what's left."
],
[
26.0,
"Use the toggle to flip between what we see and what exists in the God's view."
],
[
32.0,
"You see half of the table disappears. That's a fundamental problem of causal inference in one simple table."
],
[
41.0,
"Part 2 asks what the black numbers alone can tell us if we only observe one outcome but not both."
]
],
"check-1": [
[
0.0,
"Three quick questions to end part one."
],
[
2.4,
"Click an answer to see the explanation."
]
],
"estimands": [
[
0.2,
"Since individual effects are out of reach, we aim for averages. One distinction first. An estimate"
],
[
7.1,
"is what we want to know, an estimator is a recipe for guessing it. The average treatment effect, the"
],
[
13.3,
"ATE, averages tau over everyone. The ATT, the average treatment effect on the treated, averages"
],
[
23.2,
"it over the treated population. The ATU, the average treatment effect over the untreated, averages"
],
[
32.4,
"the tau over the untreated people. And since everyone is either treated or not, ATE is going"
],
[
40.4,
"to be a weighted average of the ATT and the ATU with the share treated PI as a weight. We also call"
],
[
49.8,
"the share, sometimes PI. We use that weighted average identity in a few slides, so you can"
],
[
56.9,
"keep that in mind. But now we have defined three important concepts."
]
],
"four-estimands": [
[
0.0,
"Under assignment A, ATE is 1. The ATT averages units 1 and 2, 3 and 0, so 1.5. The ATU averages units 3 and 4, so we get 0.5."
],
[
13.7,
"And 1.5 times 1.5 plus 1.5 times 0.5 gives back 1."
],
[
20.3,
"The treated happen to be the units that respond more. That's not a problem, heterogeneity, but the answer depends on whose effect you ask about."
],
[
32.3,
"Click the D buttons. You see the ATE never moves, while the ATT and ATU move a lot. Check that identity yourself for assignment B."
]
],
"which-estimand": [
[
0.2,
"Which average should we care about? It depends on the decision."
],
[
4.5,
"If a policy were applied to everyone eventually, like a new checkout page, you want the ATE."
],
[
9.8,
"If it's voluntary or targeted, like a loyalty program customers can choose to join,"
],
[
15.2,
"you mostly want the ATT, the effects on the people who would take it up."
],
[
20.0,
"As we go through the course, notice what estimate each method delivers."
],
[
24.9,
"Experiments give the ATE for the people in them."
],
[
27.4,
"Most observational designs give the ATT."
],
[
31.0,
"Instrumental variables give something narrower than both, and we are going to explain that later."
],
[
36.5,
"For example, the effect of a loyalty program on customers who would never sign up"
],
[
41.2,
"is not very useful for the decision-making process."
],
[
45.6,
"The ATT is also much easier to learn,"
],
[
49.0,
"because we only need a stand-in for the treated group's missing outcomes."
],
[
52.6,
"We don't need to collect data for the untreated group."
]
],
"sdo": [
[
0.2,
"What does the data give us? The natural thing to compute is a simple difference in outcomes,"
],
[
6.2,
"that's called the SDO, the average outcome of the treated minus that of the untreated. In a sample,"
],
[
14.1,
"that's also called the difference in means, or the slope from regressing the outcome on a treatment"
],
[
19.8,
"dummy. The treated show us their y1 and untreated show us their y0. Compare that with ATT."
],
[
29.2,
"The first term match, but the ATT needs the treated units on y0, which we'll never see. The SDO"
],
[
37.1,
"uses the untreated units y0 instead. That's a different group. For our four units, you can"
],
[
44.6,
"compute the SDO is one and a half. It equals the ATT and not the ATE. The next slide explains why it"
],
[
54.4,
"lands on the ATT here, and when it doesn't."
]
],
"decomp1": [
[
0.2,
"Here is the first decomposition exercise. Click through the steps."
],
[
3.9,
"Start from the SDO and add and subtract the counterfactual we'll never see"
],
[
8.6,
"the average untreated outcome of the treated. Grouping the terms gives the ATT plus selection"
],
[
16.6,
"bias. The difference in untreated outcomes between the treated and the untreated."
],
[
22.8,
"Read that carefully. Selection bias is not about what the treatment does. It's about who gets"
],
[
29.0,
"treated. Would the treated have looked different without treatment? In our example, both groups"
],
[
36.0,
"have the same average Y0. So the bias is zero and SDO indeed equals the ATT. And this decomposition"
],
[
45.2,
"is an identity, always true. Assumptions only come in when we argue the selection bias is zero or not."
],
[
52.6,
"Here we have an example where the selection bias is zero. You see this identity again and again in"
],
[
58.2,
"this course. Every time we ask what a comparison actually measures."
]
],
"signing": [
[
0.2,
"Signing the selection bias is a skill you use all the time. Let me give you three examples."
],
[
6.2,
"Hospitals. If we want to compare the health status of the people who are hospitalized versus"
],
[
12.9,
"those who are not, we need to remember that people who go to the hospital will be sicker anyway."
],
[
19.1,
"So here the selection bias is negative and the hospitals or hospitalization makes people look"
],
[
25.0,
"more harmful. Job training and earnings. Participants earn less even before the program"
],
[
32.9,
"and they are more likely to join the program. So again negative and a naive comparison"
],
[
38.6,
"would understate the benefits from the job training program. The grace periods. Borrowers who asked"
],
[
48.0,
"would have defaulted more anyway. So the bias is positive here and the naive 25 points of the"
],
[
56.1,
"overstated and in fact that the experiment found to be about zero. The rule here is that ask whether"
],
[
63.1,
"the treatment would have looked different without the treatment and in which direction. You'll be"
],
[
69.4,
"asked to do this on the exam so it's better to practice this with every example in this course."
]
],
"ashenfelter": [
[
0.2,
"Here is a job training example, with data from Orley Ashenfelter. Earnings of men who entered"
],
[
6.8,
"the 1964 training program and of a comparison group. Trainees earned much less in every year"
],
[
14.2,
"before the program. Selection bias in plain sight. And their earnings dipped right before the training"
],
[
21.8,
"because people tend to enroll in the program after a very bad year. And that observation"
],
[
27.8,
"is called the Ashenfelter dip. A naive comparison would mix the program's effect"
],
[
33.6,
"with that gap. And the before and after comparison is also going to be muddled by the dip."
],
[
40.5,
"The second problem is what difference in differences can overcome later in this class."
],
[
47.5,
"Toggle down between the two groups of men, the pattern is the same."
],
[
52.8,
"Lower earnings before the program and the dip just before it."
]
],
"decomp2": [
[
0.2,
"If what you want is the ATE, there is a second core source of bias."
],
[
5.1,
"Here's the intuition. Even if the treated and untreated had the same untreated outcomes,"
],
[
10.9,
"the treated might respond more to the treatment, and the SDO measures their effect,"
],
[
16.4,
"not the average effect across all the population. Formally, we can rewrite ATT as the ATE"
],
[
24.5,
"plus 1 minus pi times the gap between ATT and ATU, and we can substitute. Now the SDO equals the ATE"
],
[
35.4,
"plus selection bias plus what we call the heterogeneous effect bias."
],
[
41.8,
"The third term vanishes if everyone has the same effect, or if the treated and untreated would"
],
[
48.5,
"respond the same to the treatment on average. In our example, 1.5 equals 1 plus 0 plus 1.5."
],
[
58.8,
"Mastering 'Metrics assumes constant effects, so you won't see that heterogeneous effect bias term there,"
],
[
66.4,
"but it's worth noting that the treatment might have heterogeneous effect on the people who get"
],
[
73.0,
"treated and the people who are not."
]
],
"two-rules": [
[
0.0,
"Your turn. This starts at assignment B, self-selection. Units 2 and 4, whose untreated outcome is high, take the treatment."
],
[
10.0,
"Now the SDO is 1, the same as ATE, but right for the wrong reasons. The treated are exactly the unit the treatment does nothing for, and therefore the ATT is actually 0."
],
[
23.0,
"Now the SDO comes purely from the selection bias. Click the D button to try other assignments."
],
[
32.0,
"Both decompositions always hold. Then switch to what we see. You get only SDO, and nothing tells you which story produced the SDO, whether it's a selection story or a treatment story."
],
[
46.0,
"This is why you can never judge the design by whether its answers look reasonable or not."
],
[
52.0,
"A naive comparison can land on the right number just by luck, and you'll never know."
]
],
"check-2": [
[
0.5,
"Three questions on part 2."
],
[
2.5,
"For the first, use the clickable table if you like."
]
],
"independence": [
[
1.1,
"Part 3 is the cure. The key assumption is independence."
],
[
6.1,
"Treatment is independent of the potential outcomes."
],
[
9.1,
"Knowing who was treated tells you nothing about how they would do with or without treatment."
],
[
15.1,
"We only need a version for averages."
],
[
18.1,
"The treated and untreated have the same average y0 and the same average y1."
],
[
24.1,
"Random assignment delivers this by construction. Because a coin flip knows nothing about anyone, nothing else guarantees it."
],
[
32.1,
"You can't test independence from outcomes, but you can make it true by research design."
],
[
38.1,
"In words, the treated are not healthier, richer, more motivated, or more responsive than untreated, on the average or in any other way."
]
],
"random-removes": [
[
0.2,
"Watch what independence does to the two bias terms."
],
[
4.2,
"Under independence, the treated and untreated have the same average y0, so the selection bias is 0."
],
[
12.2,
"The ATT and ATU are equal to 2, so the heterogeneity would also vanish."
],
[
18.2,
"So with random assignment, the simple difference in means equals the average treatment effect."
],
[
25.2,
"Correlation is indeed causation, and correlation was created by a coin flip."
],
[
32.2,
"The naive comparison is no longer naive."
],
[
35.2,
"That's the entire logic of a randomized experiment, shown in a mathematical way."
]
],
"selection-dial": [
[
0.0,
"Let's see this in a bigger population, 100,000 simulated stores where bigger stores respond"
],
[
6.5,
"more to the promotion."
],
[
8.7,
"The true average effect is about 5."
],
[
12.3,
"The dial sets how strongly big stores opt in."
],
[
16.5,
"At the starting value, the difference in means is about 21, 4 times the truth."
],
[
23.0,
"The bar takes it apart."
],
[
25.4,
"This is a selection bias, since adopters would sell more anyway."
],
[
30.4,
"A small part is a heterogeneity term."
],
[
33.8,
"Now you can turn the dial down."
],
[
36.8,
"Both bias terms shrink, and at a zero, which is going to be a coin flip, because the big"
],
[
42.6,
"stores is not going to select itself into the promotion."
],
[
46.5,
"The promotion is as randomly assigned, then you see the difference in means lands exactly"
],
[
54.2,
"on 5."
],
[
56.0,
"The buttons can jump straight to the coin flip and back, and the difference between them"
],
[
61.4,
"is going to be the selection."
]
],
"lln-sdo": [
[
0.2,
"Real data gives us sample averages, not population averages. The law of large numbers"
],
[
6.5,
"is going to connect the two. The chart shows difference in means from the first n stores."
],
[
11.6,
"With random assignments, the blue path wobbles for small samples and settles at 5."
],
[
17.4,
"With self-selection, the red path settles at about 21, and no amount of data could move it."
],
[
23.6,
"A deeper sample cures the noise problem but not the bias problem. You can press the button for a new"
],
[
31.5,
"random order. You see the blue path is always going to end at 5 but not the red curve. With self-selection,"
],
[
39.4,
"more data only gives you a more precise but wrong answer. That's worth remembering the next time"
],
[
45.9,
"someone tells you that their sample is huge. It can solve the noise problem but not the selection problem."
]
],
"po-regression": [
[
0.0,
"Now let's connect potential outcomes to a regression."
],
[
3.6,
"Start from switching equation and split y0 into its average, alpha and the unit-specific part ui."
],
[
11.8,
"Then the outcome equals alpha plus taui times di plus ui."
],
[
18.6,
"That looks like a regression on a treatment dummy with two twists."
],
[
22.7,
"The slope can differ across units,"
],
[
25.7,
"and the error term is each unit's untreated outcome measured from the average."
],
[
31.5,
"So far it is just algebra."
],
[
33.5,
"The question is what OLS on this equation actually estimates."
],
[
38.0,
"If the effect is the same for everyone,"
],
[
40.6,
"this is exactly the textbook regression of y on d."
]
],
"ols-ate": [
[
0.3,
"Here's why OLS recovers the average effect under random assignment."
],
[
6.3,
"The OLS slope converges to the covariance of y and d over the variance of d."
],
[
12.3,
"So with our equation, it splits into two parts."
],
[
16.3,
"The second part is the covariance of u and d."
],
[
20.3,
"That's the selection bias."
],
[
22.3,
"And under the independence assumption, that term is zero."
],
[
26.3,
"The first piece for a binary experiment is the average effect among the treated,"
],
[
31.3,
"which independence makes equal to the overall average."
],
[
35.3,
"That's the heterogeneous term again."
],
[
38.3,
"So with random assignment, OLS estimates the ATE even though every unit has its own effect."
],
[
46.3,
"In the simulation with 2000 stores, the slope is 4.5, standard error 0.6,"
],
[
53.3,
"and the true effect is that the sample is 5 within one standard error."
],
[
60.7,
"That's what sampling error looks like."
],
[
62.7,
"The estimate is close to the truth but not going to be exactly on it."
]
],
"constant-effect": [
[
0.0,
"One more connection. With a constant effect, the difference in group means equals tau plus the difference in average u between treated and untreated."
],
[
10.0,
"And that second term is exactly the selection bias."
],
[
14.0,
"So the key regression condition you learned, that error term has mean zero given the regressor, in plain words it says there's no selection bias."
],
[
24.0,
"Randomization design makes that true. Observational data is an assumption we have to argue for, and in many cases it's going to be fail."
],
[
34.0,
"With a dummy regressor, by the way, the intercept is the average outcome of the untreated, and the slope is the difference in means exactly as before."
]
],
"controls": [
[
0.5,
"What about control variables in an experiment?"
],
[
3.5,
"We don't need them for unbiasedness, but there are three good reasons to add them."
],
[
7.5,
"First, precision."
],
[
9.5,
"A control that predicts the outcome soaks up noise and shrinks the standard error."
],
[
14.5,
"Second, a check."
],
[
16.5,
"If the treatment estimate jumps when you add controls, the randomization may have failed."
],
[
21.5,
"Third, if treatment probabilities differed across groups, then you must control for the groups."
],
[
28.5,
"And the coefficients on the controls have really no causal meaning."
],
[
32.5,
"That's fine."
],
[
33.5,
"We don't need them to have causal meaning because we only care about the treatment effects."
],
[
38.5,
"What we need is weaker than before."
],
[
40.5,
"The controls can be correlated with the error term."
],
[
43.5,
"Only the treatment has to be uncorrelated once we account for the controls."
],
[
48.5,
"That's sometimes called the conditional mean independence assumption."
]
],
"bad-controls": [
[
0.5,
"Let's see good, bad and bad controls. Each experiment draws 2,000 stores, flips a coin for each, and runs 3 regressions. No controls, a control measured before the promotion, and foot traffic, which is measured after and potentially raised by the promotion."
],
[
17.3,
"Run one experiment first, and look at the table. Then run 300. Blue, no controls, is centered on 5. Green, the pre-treatment control, is also at 5, but much narrower because controls make your estimated treatment effect more precise."
],
[
38.6,
"Red, adding the foot traffic as a control, makes the treatment effect of promotion centered around 1, and is badly biased, even though we see the treatment itself was randomized."
],
[
53.2,
"The reason is that holding foot traffic fixed and compare different kinds of stores would actually bring the selection back."
],
[
64.6,
"So here's the rule. We only control things that's fixed before the treatment. We should not control for things that might be affected by the treatment itself."
]
],
"py-po": [
[
0.0,
"Alright, here's everything so far in code."
],
[
4.0,
"The decompose function computes every term of both decompositions, which we can only do because we made up the potential outcomes."
],
[
12.0,
"The first loop checks the 4 units, the second compares self-selection with a coin flip among 100,000 stores."
],
[
20.0,
"Run it and you'll see a difference in means, about 21 under self-selection, and about 5 is a coin flip."
],
[
27.0,
"Then try weakening the selection and see how the bias shrinks."
]
],
"py-reg": [
[
0.0,
"Here's one experiment with three regressions in plain NumPy."
],
[
4.7,
"The regression without controls gives you exactly the difference in means."
],
[
8.4,
"The pre-treatment controls stay close to the truth with smaller standard error."
],
[
12.3,
"The post-treatment control is way off."
],
[
15.1,
"Change the seeds a few times to convince yourself this is not by luck."
],
[
19.6,
"In the Colab notebook, you'll find the same regressions with statsmodels"
],
[
23.6,
"and an exercise that repeats the experiment 500 times."
]
],
"check-3": [
[
0.0,
"Three questions on part 3. For the last one, think about when variable is measured."
]
],
"sutva": [
[
0.2,
"Part 4 starts with an assumption hidden in the notation. Writing just two potential"
],
[
5.6,
"outcomes per unit assumes SUTVA or the stable unit treatment value assumption."
],
[
12.2,
"First, same dose. Treated means the same thing for everyone."
],
[
17.1,
"Second, no interference. A unit outcome depends only on its own treatment, not on who else is"
],
[
23.4,
"treated. The first is about measurement and design. The second is about the economics of"
],
[
28.9,
"the setting, and it fails more often, quite more often than what people regularly think."
],
[
35.1,
"For example, if some stores run a 10% discount and others 30, there is no single promotion whose"
],
[
42.9,
"effect we can talk about. And if my outcome depends on my neighbor's treatment, I don't have one Y0."
],
[
50.9,
"I have a different one for every pattern of treatment around me. This is the case for the"
],
[
57.0,
"store. When store competes for consumers, one store's gain might be the other stores lose."
],
[
64.0,
"And therefore, my outcome might also depend on my neighbor's treatment, and the SUTVA condition may"
],
[
71.8,
"fail."
]
],
"interference": [
[
0.0,
"Some more settings with interference. Vaccines. Your vaccination lowers my risk even if I'm not vaccinated. Again, my outcome depends on your treatment, you're vaccinated or not."
],
[
13.0,
"Second, peer effects. Tutoring some students is going to change what their classmates learn."
],
[
20.0,
"Third, two-sided platforms. That's a short video case from class. Helping some creators change what everyone, every viewer sees, including the control group."
],
[
31.0,
"And lastly, the marketplaces. A discount for half of the buyer would change prices for the other half."
],
[
38.0,
"Then randomizing individuals doesn't work. What we have to do is to randomize the whole clusters, markets, or time periods."
],
[
47.0,
"And that's why you often see Uber run experiments in some cities, but not in the other cities."
],
[
55.0,
"That is the idea to randomize the whole cluster."
],
[
59.0,
"When there's interference, a simple comparison mixes the direct effect with the spillover, and you cannot separate them after that fact."
]
],
"partial-eq": [
[
0.0,
"A related limit. Experiments measure partial equilibrium effects. Give a cost-saving technology to a few firms and their profits rise relative to others. Give it to every firm and competition pushes price down until profits return to normal."
],
[
16.1,
"The experiment only measures the first effect. The same goes for a training program rolled out to a whole city or a discount offered to every customer. Going from treating a few to treating everyone needs a model of how the market responds. This is often called the scaled-up problem and it's a reason to be careful when a pilot result is used to justify a company-wide or a nationwide rollout."
]
],
"assignment": [
[
0.2,
"Back to the third ingredient, the assignment mechanism, the probability that a unit is treated"
],
[
5.8,
"given its characteristics and its potential outcomes. If that probability depends on the"
],
[
10.8,
"potential outcomes, like sick people going to hospitals, that's selection bias. If not,"
],
[
17.0,
"there isn't. When it depends only on observed characteristics but not the potential outcome,"
],
[
23.6,
"it's called the propensity score, which we'll talk about later."
],
[
26.3,
"The big idea here is that every research design is a restriction on the assignment mechanism."
],
[
33.6,
"And there are three classes on the next slide."
]
],
"three-classes": [
[
0.2,
"This table is a map of the rest of the course. First row, randomize assignment. We set the"
],
[
6.6,
"probabilities with a coin and the difference in means or regression is going to give you the"
],
[
11.8,
"causal effect because the treatment is randomly assigned. Second row, unconfounded assignment."
],
[
19.3,
"Once we conditional on observed characteristics, treatment is as good as random and we use controls,"
],
[
26.7,
"matching and propensity scores to solve the assignment problem. Third row, everything else."
],
[
34.5,
"No general fix, but important special cases like a threshold for regression discontinuity,"
],
[
41.6,
"a comparison group over time for difference in differences, and an outside nudge for instrumental"
],
[
47.9,
"variables. Only the first row is true by design. Every other row requires assumptions that we have"
],
[
56.2,
"argued for. Come back with this table as we go through the course. Each new method"
],
[
62.3,
"is going to live in one of the three classes."
]
],
"key-ideas": [
[
0.2,
"Five ideas sum up the Rubin causal model. 1. Causality is defined by potential outcomes."
],
[
6.5,
"2. Association is neither necessary nor sufficient for causation. Remember assignments."
],
[
13.1,
"3. We study the effects of causes, not the causes of effects."
],
[
18.1,
"4. No causation without manipulation. The effect of gender on wages is not going to be"
],
[
24.2,
"well defined, but the effect of a female name on resume is going to be much better designed."
],
[
30.4,
"That's why resume experiments randomize names but not people. This is the idea students sometimes find"
],
[
38.8,
"most surprising, so we should take a moment with it. In the Rubin-Causation model, the causality only"
],
[
45.9,
"exists when we can manipulate the treatment. In cases where we cannot or it's hard to think about"
],
[
53.4,
"how to manipulate the treatment, it's hard to talk about the causal effect."
],
[
57.7,
"5. And lastly, always start by asking who got treated and why."
]
],
"check-4": [
[
0.0,
"Four last questions on SUTVA and the assignment mechanism."
]
],
"summary": [
[
0.3,
"To wrap up, every unit has two potential outcomes, the switching equation reveals one, and since individual effects are unobservable, we can only aim for sample averages, ATE, ATT and ATU."
],
[
14.3,
"Two identities always hold, the difference in means equals ATT plus selection bias, and equals ATE plus selection bias plus a heterogeneity bias."
],
[
25.3,
"Random assignment wipes out both bias terms, so regression on the treatment dummy then is going to restore the average effect, under the assumption that treatment is randomly assigned."
],
[
37.3,
"Adding additional controls fixed before the treatment, never after the treatment, because they are bad controls."
],
[
44.3,
"SUTVA makes the effects a single number per unit, and the assignment mechanisms classifies every method we are going to talk about."
],
[
53.3,
"If you remember one sentence, selection bias is about who gets treated, and random assignment removes the selection bias by making everyone who gets treated a truly random thing."
]
],
"optional": [
[
0.2,
"Two pieces for optional reading. On the left, five reasons why economists like this framework."
],
[
6.5,
"My favorite one is that assumptions are stated in terms of things that could be observed,"
],
[
11.4,
"which makes them easier to argue about. On the right panel,"
],
[
15.6,
"Judea Pearl has the ladder of causation. Seeing is association, doing is intervention,"
],
[
22.0,
"selection bias is exactly the gap between them, and in a randomized experiment,"
],
[
27.4,
"seeing something is the same as doing something. Neither is required for the exam,"
],
[
32.3,
"but both are quite good ways to check the ideas that we have learned."
]
],
"next": [
[
0.4,
"That is the end of the module. The practice notebook has all the codes, the regressions in statsmodels, and a few short exercises."
],
[
8.4,
"Next, live sessions turn into the experiment design, how we randomize, how big they need to be, and what things can go wrong."
],
[
16.4,
"Thanks for watching."
]
]
};
