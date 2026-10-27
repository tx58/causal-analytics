// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
0.0,
"Welcome to this module. In the live sessions, we learn synthetic control and instrumental variables mostly through pictures and cases, California's tobacco program, the New York Times paywall, a wellness program offered, and Super Bowl. Here we look under the hood using the language from the module on potential outcomes. For each method, we ask the same questions. Which potential outcome is missing? How the method fills it in? What has to be true for that to work?"
],
[
30.0,
"and whose effect we end up estimating? There is some math, but every formula comes with a picture or simulation you can play with."
]
],
"how-to": [
[
0.0,
"A quick word on how to use this page. As before, every slide has its own voiceover. You can go at your own pace, and the transcript is under each slide."
],
[
9.3,
"There are several simulations you can drag a treated unit around its donors, break parallel trends, add defiers to an experiment, and change an instrument's strength."
]
],
"roadmap": [
[
0.0,
"The module consists of four parts. Part one sets up synthetic control in potential outcome framework."
],
[
6.7,
"Part two asks why matching the past works and how to test the result."
],
[
13.9,
"Part three turns to IV instrumental variables. We are going to talk about compliance types"
],
[
20.4,
"and the LATE theorem. And part four is about how to apply LATE in practice."
]
],
"one-unit": [
[
0.0,
"Let's set up synthetic control in the language of potential outcomes."
],
[
4.6,
"There are J plus 1 units observed over T periods."
],
[
9.4,
"Unit 1, say California, is treated from period T0 plus 1."
],
[
15.9,
"The other J units, the donor pool, are never treated."
],
[
20.2,
"For unit 1, in each period, there are two potential outcomes, YI with the intervention and YN without it."
],
[
28.2,
"They are the same objects as Y1 and Y0 from the first module."
],
[
34.6,
"I denotes intervention and N denotes none."
],
[
39.2,
"The effect in each post period is going to be YI minus YN."
],
[
45.2,
"And since unit 1 is treated, YI is just what we observed."
],
[
51.1,
"So the missing piece is YN after the intervention."
],
[
54.7,
"What California smoking would have been without the program."
],
[
59.3,
"And with a single treated unit, there is nothing to average over."
],
[
64.1,
"Every method has to compute a whole path from the donors."
]
],
"did-imputes": [
[
0.0,
"How will difference in differences fill in California's missing path?"
],
[
4.2,
"It takes California's pre-period levels and adds the average change of the donors."
],
[
10.1,
"That's two assumptions in one."
],
[
11.8,
"The first thing is every donor should get the same weight, and the second thing is we hope the trends are parallel."
],
[
18.8,
"Now let's look at the first thing."
],
[
21.0,
"Before 1988, California smoking was already falling faster than the average of other 38 states."
],
[
28.6,
"Parallel trends fails before the program even starts, and the average of all states is just a poor stand-in for California."
],
[
38.3,
"This is quite common."
],
[
40.6,
"Policies are often launched in response to a crisis, and outcomes may revert on their own."
],
[
47.2,
"Remember the Ashenfelter dip."
],
[
49.7,
"Trainees' earnings drop just before they join, and the choice of comparison group is often arbitrary,"
],
[
55.7,
"synthetic control addresses both issues."
]
],
"two-stories": [
[
0.0,
"Now I'll step back for a moment. There are two classic ways to fill in a missing untreated outcome in panel data, and they actually rest on quite different stories about the selection."
],
[
12.6,
"The fixed-effects approach assumes treated units differ by a permanent unobserved level called Alpha-I. Once you remove it, treatment is as good as random."
],
[
24.1,
"The lagged outcome approach assumes instead that units were selected on their past outcomes, like a bad year, and conditions on those past outcomes, that's going to be as good as random."
],
[
39.3,
"Again, that's unconfoundedness, just like in propensity score module."
],
[
44.7,
"Which story is right depends on how the treatment was chosen."
],
[
49.0,
"A state that adopts a policy because it's always been progressive fits a fixed-effect story."
],
[
55.8,
"A firm that launches a turnaround plan after one terrible quarter fits the lagged outcome story."
],
[
62.6,
"And there, difference in differences would credit the plan with a recovery that was coming anyway."
]
],
"comparative": [
[
0.0,
"Synthetic control grew out of the so-called comparative case studies. In the famous example, David Card asked whether the 1980 Mariel boatlift, which raised Miami's labor force by 7% almost overnight, hurt less skilled workers there."
],
[
17.5,
"He compared Miami with four cities chosen by judgment, Atlanta, Los Angeles, Houston, and Tampa."
],
[
24.4,
"Working with aggregates like cities and states helps, because averages are less noisy."
],
[
32.8,
"But no single city is a close match for Miami."
],
[
36.1,
"The insight of Abadie, Diamond, Hainmueller is that a weighted average of donors often resembles the treated unit much better than any one of the donors, or just taking the simple average."
],
[
47.5,
"And the weights can be chosen systematically to reproduce the treated unit's characteristics before the intervention."
]
],
"estimator": [
[
0.0,
"Here's how the estimator is constructed."
],
[
2.7,
"A synthetic control is a set of weights on the donors, all non-negative and summing up to 1."
],
[
9.2,
"X1 collects unit 1's characteristics before the intervention, and X0 the same characteristics for the donors."
],
[
16.9,
"They usually include some pre-period outcomes and other predictors of the outcome."
],
[
22.5,
"We pick the weights that make the weighted average of the donors as close as possible to unit 1 on those characteristics."
],
[
30.0,
"The weights say how much each characteristic counts, and they are usually chosen so that the synthetic tracks unit 1's pre-period outcomes as closely as possible."
],
[
44.0,
"And the imputed, untreated path is the same weighted average of donors' outcomes after the intervention, and the effect is a gap between unit 1 and its synthetic."
],
[
56.9,
"Notice what this does to the comparison with difference-in-differences."
],
[
61.9,
"DiD also uses the weighted average of donors with equal weights, and then it adjusts for the level gap."
],
[
70.9,
"The synthetic control chooses unequal weights so that no level adjustment is needed."
],
[
76.9,
"The synthetic is supposed to match unit 1's level and its trend before the intervention."
],
[
81.9,
"That's why it can work when trends aren't parallel on average."
],
[
86.9,
"It finds the donors whose trends are parallel to unit 1's."
]
],
"hull": [
[
0.0,
"Here is the geometry. Imagine only two predictors, so each donor is a point. Because the weights are non-negative and sum to one, a synthetic control can only land inside the shaded area, or the so-called convex hull of the donors."
],
[
16.9,
"The best synthetic is the point in that area closest to the treated unit."
],
[
22.3,
"The orange treated point starts outside the hull. The synthetic lands on the nearest edge using only two donors, and some mismatch still remains."
],
[
33.5,
"If you drag the points around, outside the hull, the synthetic always sits on an edge or a corner with one or two donors."
],
[
42.5,
"That's why synthetic control weights are usually sparse, because with many predictors, the treated unit is almost never inside the hull."
],
[
51.4,
"Drag it inside, and the fits become perfect. But then many different weights fit equally well."
],
[
58.8,
"And this is also the method's honesty. It refuses to extrapolate. If the treated unit is unlike any combination of the donors, the poor fit will tell you so."
]
],
"p99-recipe": [
[
0.0,
"Here's a recipe for synthetic California from the live session's replication. Five states get positive weight. Utah, Nevada, Colorado, Montana, and Connecticut. The other 33 get zero, just as the geometry predicts. The weights are close to the published ones. The small differences come mostly from the optimizer, because we use different optimizers from the original paper."
],
[
27.3,
"On the right is the fit. Before 1989, the synthetic matches California's cigarette sales in 1975, 80s, and 88, almost exactly. And it matches the retail price and beer consumption, too. The average of the other 38 states smoked far more by 1988."
],
[
49.0,
"After 1988, the gap between California and its synthetic averages minus 18 packs per person, about 23%."
]
],
"regression-weights": [
[
0.0,
"How does this compare with regression? A regression of the donors' post-period outcomes on their characteristics, evaluated at the treated unit's characteristics, turns out to be a weighted average of the donors too, with the weights shown here."
],
[
17.0,
"Those regression weights also sum to one, but they can be negative or larger than one, which means extrapolation and they spread over every donor."
],
[
26.5,
"The chart shows West Germany. The synthetic control uses five countries, led by Austria, United States, Japan."
],
[
34.5,
"The regression uses all 16 with negative weights assigned effectively on Greece, Portugal, Italy, and Spain."
],
[
41.5,
"For California, regression puts negative weights on 12 states and gives a smaller effect, minus 11 packs instead of minus 18."
]
],
"factor": [
[
0.0,
"Why does matching the past actually work? Synthetic control isn't derived from a model, but its authors justify it with an as-if model for the untreated outcome."
],
[
11.1,
"Each unit's outcome is a common shock, plus a common factor called lambda-t times the unit's own loading muI plus noise."
],
[
21.0,
"Think of muI as how exposed the unit is to some force, like national decline in smoking."
],
[
27.4,
"If the factor is constant over time, lambda-t times muI is just a fixed effect, and we are back in the difference in differences with parallel trends."
],
[
38.6,
"But if the factor moves, units with different loadings trend quite differently, and parallel trends would fail."
],
[
46.1,
"Here is the key."
],
[
47.5,
"If the synthetic matches unit one's outcome over a long pre-period, its weight loading has to match unit one's loading."
],
[
55.4,
"And then it keeps tracking unit one's untreated path after the intervention, even as those factors move."
],
[
63.6,
"The catch here is that with noisy outcomes and a short pre-period, the weights can fit the noise instead of the variable."
],
[
73.4,
"In potential outcome terms, this is a whole identification argument."
],
[
77.1,
"The synthetic's untreated outcome equals unit one's untreated outcome apart from noise."
],
[
84.5,
"Because both are built from the same common shocks and the same loading."
],
[
89.2,
"Difference in differences needs the loadings to be irrelevant."
],
[
93.0,
"Synthetic control only requires loadings to be matchable."
]
],
"factor-sim": [
[
0.0,
"Let's see it in a simulation. We have 20 donors, each with its own loading between 0 and 2, and a common factor that rises over time, so units with bigger loadings would rise faster."
],
[
15.0,
"The treated unit has a loading of 1.5, and the true effect is minus 8 from period 21 onward."
],
[
23.0,
"Difference in differences in blue assumes the treated unit follows the average donor, so it gets the wrong trend and the wrong effect."
],
[
33.0,
"The synthetic control in green matches the pre-period, finds donors with loadings near 1.5, and lands close to minus 8."
],
[
43.0,
"Now push the treated loadings above 2, outside the donor's range."
],
[
47.0,
"Now no combination of donors can keep up."
],
[
51.0,
"The pre-period fit gets visibly worse and the estimate goes wrong."
],
[
57.0,
"Then raise the noise and shorten the pre-period."
],
[
60.0,
"Again, the weights start chasing noise and the fit gets worse."
]
],
"bias": [
[
0.0,
"What controls the bias? First, noise against the pre-period length. The weight fits the past better when the past is long and the outcome isn't too noisy."
],
[
12.8,
"That's why synthetic control works best with aggregates like states and countries and long histories, as long as the world didn't change along the way."
],
[
22.0,
"Second, interpolation. A synthetic can match the treated units on average while every ingredient is far away, so restricts the donor pool to units that are similar to begin with."
],
[
36.0,
"Third, the donor pool. More donors make a close fit easier but also make overfitting easier, and drop units hit by similar policies as the Prop 99 study drops states with their own tobacco programs."
],
[
52.0,
"Finally, read the pre-period fit carefully. A poor fit is a warning because the method won't extrapolate to fix it."
]
],
"sc-assumptions": [
[
0.0,
"Let's state assumptions in potential outcome framework."
],
[
4.0,
"First, no anticipation. The pre-period must really be untreated."
],
[
8.8,
"If people reacted to the announcement before the program started, move the start date earlier."
],
[
15.7,
"Second, no interference. The donors' observed outcomes must be their untreated outcomes."
],
[
21.6,
"If California's tax sent smokers across the border to buy in Nevada, Nevada sales would rise and the effect would be overstated."
],
[
30.0,
"Third, nothing else may hit California alone at the same moment."
],
[
35.3,
"Shocks shared with the donors are fine because the synthetic absorbs them."
],
[
39.5,
"Fourth, the synthetic that tracks California before the program must have kept tracking it,"
],
[
45.0,
"which is what the factor model argument delivers."
],
[
48.5,
"And lastly, a good fit must be possible at all."
]
],
"inference": [
[
0.0,
"How do we know the gap isn't just by chance? With a single treated unit, there's no central limit theorem and no usual standard error. Instead, synthetic control borrows the shuffling logic from the module on experiments."
],
[
14.0,
"If the program did nothing, California is just one of the 39 states. So we pretend each donor state was treated in 1989, build its own synthetic control from the remaining states, and compute its gap."
],
[
28.0,
"Those are the gray lines. Before 1989, they all hover around zero. After 1989, California's red line falls below almost every other placebo, a gap that's large rarely happens by chance among the states that weren't treated."
]
],
"ratio": [
[
0.0,
"Some placebo states fit their own past badly, so their post-period gaps are large for reasons that have nothing to do with the treatment."
],
[
8.7,
"The standard fix is to divide each state's post-period miss by its pre-period miss."
],
[
14.1,
"A state with a good fit before and a big gap after gets a large ratio."
],
[
19.3,
"California ranks first of 39 states."
],
[
23.4,
"If the program really did nothing, the chance that California would come out on top is 1 in 39,"
],
[
30.0,
"a p-value of 0.026, which is the smallest this design can produce."
],
[
36.2,
"Dropping the badly-fitting placebos instead gives the same verdict."
]
],
"robustness": [
[
0.0,
"Two more checks. Backdating is a placebo in time. You can pretend the program started in 1980 and see whether a gap appears where none should."
],
[
10.0,
"Here the gaps stay near zero from 1980 to 1984 but then open up to minus 4 to minus 9 packs from 1985 on before the program."
],
[
22.0,
"So that's sort of the mixed results. Some divergence may have started early and we should report it honestly."
],
[
29.0,
"The second check is called the leave-one-out, which asks whether the result hinges on one particular donor."
],
[
36.0,
"Dropping each donor with positive weight in turn, the average gap stays between the minus 17 and a half to minus 20 packs."
],
[
46.0,
"So the result was not driven by a single state."
]
],
"extensions": [
[
0.0,
"There are several extensions of this simple one-treated-unit synthetic control framework."
],
[
7.2,
"First extension is when we have several treated units."
],
[
10.8,
"We can build one synthetic per unit and then aggregate, just like what we did across cohorts and calendar times in staggered difference-in-differences."
],
[
21.1,
"The second extension is called synthetic differences in differences,"
],
[
24.9,
"which is a combination of both synthetic control and DID methods."
],
[
30.2,
"Essentially, it allows both weights and a level shift."
],
[
34.6,
"The third extension is called generalized synthetic control, which estimates the factor model directly,"
],
[
40.9,
"and that's what the New York Times Paywall study used across metro areas."
],
[
45.8,
"We also have penalized and augmented versions, which are used to guard against faraway donors and imperfect fits."
],
[
54.7,
"I'm not going to examine you on this, and this is just for your own knowledge."
]
],
"py-sc": [
[
0.0,
"Here's synthetic California in code, the function synth finds non-negative weights that sum up to 1 and best match California's smoking from 1970 to 1988."
],
[
13.0,
"Then the placebo loop does the same for every other state and ranks the post over pre ratios."
]
],
"check-1": [
[
0.0,
"Here are three questions to test your understanding on synthetic control."
]
],
"iv-recap": [
[
0.0,
"Now let's move on to IV. Let's start with what you know from the live session."
],
[
6.2,
"The outcome is a constant plus beta1 times the treatment plus an error."
],
[
11.4,
"The treatment is correlated with the error, so OLS is biased."
],
[
16.8,
"An instrument that moves the treatment and is unrelated to the error gives beta1 as a ratio."
],
[
23.3,
"The effect of the instrument on the outcome, the reduced form, divided by the effect on the treatment, the first stage,"
],
[
29.2,
"is going to give you the IV estimate."
],
[
33.2,
"It's a binary instrument that's also called the Wald ratio of the two differences it means."
],
[
40.2,
"But notice the hidden assumption."
],
[
42.2,
"Beta1 is the same for everyone."
],
[
44.2,
"In the language of potential outcomes, effects could differ across people."
],
[
48.2,
"So what does the ratio estimate when they do differ across people?"
]
],
"potential-treatments": [
[
0.0,
"The key new idea here is that the treatment has potential outcomes, too."
],
[
4.8,
"We can define D1i is what unit i would do if the instrument was switched on, and D0i if the instrument was switched off."
],
[
14.6,
"The observed treatment follows a switching equation, just like the outcome, D0 plus difference times z."
],
[
22.8,
"And the difference, D1 minus D0, is unit i's own causal effect of the instrument on the treatment."
],
[
30.0,
"As always, you only see one of the two."
],
[
33.7,
"The classic example is Joshua Angrist's study on the Vietnam draft."
],
[
37.7,
"The instrument is draft eligibility assigned by a lottery over birth dates."
],
[
43.0,
"The treatment is military service."
],
[
45.4,
"The outcome is earnings in the 80s."
]
],
"types": [
[
0.0,
"Potential outcomes, potential treatments sort everyone into four types."
],
[
5.1,
"Compliers take the treatment if instrument is on and not otherwise."
],
[
9.0,
"In the draft case, men who served because they were drafted is the example."
],
[
14.5,
"Always-takers take it either way, like volunteers."
],
[
18.6,
"Never-takers never do, like men exempt for some health reasons."
],
[
23.5,
"And defiers do the opposite of what the instrument says."
],
[
26.8,
"On the right is what we actually see."
],
[
29.5,
"Each cell of the data mixes different types."
],
[
33.0,
"Among those not-drafted and not-serving, there are compliers and never-takers."
],
[
38.9,
"Among those drafted and also serving, there are compliers and always-takers."
],
[
44.1,
"Now, if we rule out defiers, the cross-out entries disappear, and the two cells contain only a single type."
],
[
51.6,
"Drafted men who didn't serve, they are never-takers, and undrafted men who served, they are always-takers."
]
],
"assumptions": [
[
0.0,
"We need four assumptions to establish what IV estimates really are."
],
[
4.1,
"The first assumption is called independence. The instrument is as good as randomly assigned,"
],
[
9.2,
"so it's unrelated to everyone's potential outcomes and potential treatments."
],
[
14.2,
"2. Exclusion. The instrument affects the outcome only through the treatment."
],
[
20.6,
"3. The first stage. The instrument actually changes the treatment for somebody."
],
[
25.8,
"4. And lastly, monotonicity. Essentially, there are no defiers. The instrument can only push people in one direction."
],
[
35.3,
"Now think about the coupon mailed at random. Independence holds because it's random, it's by lottery."
],
[
43.3,
"Exclusion fails if the mailing itself works as an ad."
],
[
49.7,
"Monotonicity would fail if some people refused to buy because they got a coupon."
],
[
55.4,
"And they would buy if they don't."
],
[
58.6,
"With exclusion, the outcome depends only on the treatment."
],
[
62.2,
"So we're back to the familiar Y1-Y0 scenario."
]
],
"where-instruments": [
[
0.0,
"Where do instruments come from in practice? Randomized offers, or encouragement designs, like a coupon or wellness program offered at random, get independence by design."
],
[
10.9,
"We worry more about exclusion. Does the offer itself work like an ad that encourages people? Lotteries like the draft or charter school lotteries are similar. Did winning a lottery also change some other choices related to the outcome?"
],
[
25.3,
"Random assignment to decision makers, like loan officers or judges with different leniency, raises a monotonicity worry. An officer might be lenient on one kind of case and strict on the other."
],
[
39.3,
"Geography, like distance to a college, raises questions on independence, because location may also track income."
],
[
46.8,
"And shock, such as weather or whose team plays in the Super Bowl, might threaten the exclusion assumption, because they may change other things in addition to the advertising."
]
],
"rf-fs": [
[
0.0,
"Now what do the assumptions buy? Independence actually buys a lot. It makes the comparison of the outcomes across instrumental groups as a causal effect."
],
[
10.0,
"The reduced form, which is the intention to treat effect from the first module we learned, is the effect of the offer itself."
],
[
18.0,
"It makes the comparison of treatment rates causal. The first stage is kind of the average effect of the instrument on the treatment."
],
[
27.0,
"Now if we add monotonicity and d1 minus d0 equals 1 for compliers and it's going to equal 0 for everybody else."
],
[
36.0,
"So you can see the first stage becomes a simple share of the compliers in the population."
]
],
"late-theorem": [
[
0.0,
"Here's a so-called LATE theorem in three steps. Step one, split the reduced form by type. According to exclusion assumption, each person's outcome moves only if their treatment moves."
],
[
12.7,
"Always-takers and never-takers do the same thing whatever the instrument says, so they contribute nothing. Compliers contribute their effect weighted by their share, and defiers contribute their effect with a minus sign because the instrument pushes them out of treatment."
],
[
30.0,
"Step two, monotonicity, rules out defiers. So reduced form is just the share of compliers times their average effect."
],
[
39.2,
"This is the third step. We divide the first stage, which is exactly the share of the compliers. Now the ratio is the average effect for compliers."
],
[
50.5,
"That's the local average treatment effect, or LATE. That's the theorem of Imbens and Angrist."
],
[
56.2,
"Notice what we didn't need. We never assume the effect is the same for everyone. Always-takers can gain a lot, never-takers can gain nothing, and compliers may be somewhere between."
],
[
69.3,
"The ratio still has a clean meaning. It's just the meaning of the average treatment effect for one subgroup, the complier group."
],
[
78.3,
"That's potentially the price of allowing a different effect. Now the instruments tell us only the average effect of the people the instrument shifts, and only those subgroup of people."
]
],
"late-sim": [
[
0.0,
"Now let's break the theorem on purpose. Here's a population with four types, each with its own effect."
],
[
6.6,
"At the start, there are no defiers and no direct effects of the instrument, so the Wald ratio equals the compliers effect."
],
[
13.9,
"Four, even though always-takers gain eight and never-takers gain only one."
],
[
20.1,
"Notice that the average effect and the effect on the treated are different numbers."
],
[
23.7,
"Now add some defiers. Their effects enter with a minus sign, so the ratio drifts away from the compliers effect."
],
[
33.1,
"Let's set defiers back to zero and add a direct effect of the instrument."
],
[
37.4,
"That violates the exclusion assumption. The bias equals direct effect divided by the first stage,"
],
[
43.6,
"so it explodes when the first stage is small. Lower the share of compliers and watch what happens."
]
],
"weak-iv": [
[
0.0,
"The theorem also explains why a weak first stage is dangerous. Suppose exclusion fails a little bit. The instrument has a small direct effect, delta, on everyone's outcome."
],
[
11.0,
"And the Wald ratio equals the LATE plus delta divided by the share of compliers. A direct effect of point one is harmless when 60% are compliers, but it's going to be fatal when only 2% are compliers."
],
[
25.0,
"The bias now magnifies to 5. Defiers work the same way, shrinking the denominator, and in real samples, a weak instrument also makes the estimate noisy and pulls two-stage least squares towards the OLS estimates."
],
[
41.5,
"So always check the first stage first. The cases in the live session were pretty strong. The Illinois first stage had an f-stat about 4200. That's pretty reassuring."
]
],
"draft": [
[
0.0,
"Here's the draft lottery read as a LATE."
],
[
4.7,
"For white men born in 1950, draft eligibility lowered 1981 earnings by about $436."
],
[
12.4,
"That's a reduced form."
],
[
14.4,
"Eligibility raised the probability of serving by 16 points."
],
[
18.5,
"That's the first stage."
],
[
19.5,
"And it says 16% of men are compliers."
],
[
22.9,
"Now the ratio, minus $2,741, is the effect of military service on the compliers."
],
[
32.3,
"And who are the compliers?"
],
[
34.1,
"What are the local group in the LATE?"
],
[
37.4,
"The local group of compliers are the men who served because they were drafted."
],
[
43.1,
"They are not volunteers who would have served anyway."
],
[
46.2,
"And they are not men exempted for the health reasons."
],
[
49.7,
"So the LATE estimates are the treatment effects of serving in the army on the people who are shifted to the army because they were drafted."
],
[
63.6,
"That's the important point."
],
[
65.3,
"And that's why LATE is not the same as the average treatment effect or average treatment effect on the treated."
]
],
"counting": [
[
0.0,
"Now, how many compliers are there? With independence and no defiers, two things can tell us. Among those not offered, everyone treated is an always-taker. Among those offered, everyone untreated is a never-taker. And the difference in treatment rates is the compliers."
],
[
19.7,
"For example, you can take the JTPA job training experiment, where training was offered at random to about 6,800 adults. 65% of those offered trained, and 1.3% of those not offered trained anyway."
],
[
35.3,
"So 1.1% are always-takers, 64% compliers, and 35% never-takers. Now, in the KIPP charter-school lottery, the Mastering 'Metrics example, compliers are about 74%."
],
[
49.7,
"Now, these shares are going to matter for interpretation. A LATE based on 64% of the population tells you most people. A LATE based on 16%, as in the draft lottery, tells you about the effect on a much narrower group."
],
[
65.3,
"And you should think hard about who are those people before applying this number to a broader population."
]
],
"att-ate": [
[
0.0,
"LATE is not the effect on the treated and not the average treatment effect."
],
[
4.9,
"The treated includes always-takers plus the compliers who happen to get the treatment."
],
[
10.1,
"The effect on the treated is the weighted average of the always-takers effect and the compliers effect."
],
[
16.8,
"Likewise, the untreated would mix never-takers and compliers, and the average effect mixes all the three."
],
[
23.2,
"IV is pretty silent on the treatment effects on always-takers and never-takers, because instruments never changes what they would do."
],
[
33.2,
"Assuming their effects equal the compliers is an additional assumption. That's something the data could show."
],
[
41.2,
"That's one important exception. With one-sided non-compliance, where nobody in the control group can get the treatment, there are essentially no always-takers."
],
[
50.2,
"Everyone treated is a complier, and then the ratio of the LATE effect is the same effect as the effect on the treated, or the ATT."
],
[
60.2,
"That's why the exception matters so much in business experiments."
],
[
64.2,
"When a firm offers a new service to a random half of its customers and they can make sure the other half cannot get it,"
],
[
72.2,
"the ratio of the intention to treat effect and the take-up rate is the effect on consumers who actually use the service."
],
[
80.2,
"And this is often the exact ATT the manager likes to see."
]
],
"jtpa": [
[
0.0,
"Here are four answers to the question."
],
[
2.0,
"What did job training do for earnings?"
],
[
4.0,
"The intention-to-treat effect is about $1,390 over 30 months."
],
[
9.0,
"That's the effect of offering, diluted because a third of those offered never got trained."
],
[
16.0,
"Divided by the first stage, 64% people got trained, and you get $2,170 per trainee among compliers."
],
[
25.0,
"With so few always-takers, that's pretty close to the effect on the treated."
],
[
29.0,
"The as-treated comparison, so-called trainees against everyone else, and the per-protocol comparison are purely observational."
],
[
39.0,
"They just happen to be near the LATE, but nothing guarantees they can have a causal interpretation."
]
],
"complier-means": [
[
0.0,
"Now here's a pretty useful trick. We can't label individual compliers, but we can estimate their average potential outcomes, both with and without treatment, using the formulas shown."
],
[
11.4,
"A never-taker's untreated outcomes is observed directly. They're the people offered the program who didn't take part."
],
[
19.0,
"Apply it to Illinois Wellness Program from the live session."
],
[
22.2,
"Compliers go to the gym about 7.4 times a year with the program, and 7.5 times without it, essentially no effect."
],
[
32.3,
"Never-takers go only 3.8 times."
],
[
35.6,
"So the naive gap between participants and non-participants, that's plus 3.5 visits, is entirely driven by selection, that people who sign up were gym goers anyway."
]
],
"extrapolate": [
[
0.0,
"Can we extrapolate from compliers to everyone else? Strictly no. IV identifies only the complier's effect. But the data can warn you. You can estimate the outcome levels for each type and then compare compliers' untreated outcomes with never-takers and compliers' treated outcomes with the always-takers. In JTPA, compliers and never-takers are almost the same without training, so compliers' effect is a more plausible guide for the never-takers."
],
[
28.4,
"There are only 34 always-takers, too few to say much about the effects."
],
[
34.4,
"Now in the wellness program, never-takers go to the gym half as often as compliers. They're quite different people, and the zero effect for the compliers tells us little about what the program would do for those people."
]
],
"latent": [
[
0.0,
"Who exactly are the compliers? A latent index model gives us a picture. Each person has an unobserved resistance to treatment."
],
[
8.0,
"b. They take the treatment if gamma0 plus gamma1 times z exceeds their resistance."
],
[
15.0,
"People with low resistance take it anyway, they are always-takers. People with high resistance never do."
],
[
22.0,
"The compliers are the band in between, and the LATE is the average gain in that band."
],
[
28.0,
"Suppose gains fall with resistance. Eager people gain most. Move the instrument's strength, gamma1, a stronger instrument pulls in more resistant people, and so the LATE falls."
],
[
40.0,
"The two valid instruments can give two different LATEs. Without either being wrong, they simply move different groups of people. They have different compliers."
],
[
50.0,
"This picture also shows why the effect on the treated is usually larger than the LATE here."
],
[
55.0,
"The treated include the always-takers, the least-resistant, and the biggest-gainers."
],
[
60.0,
"And the average effect for everyone sits lower still because this includes never-takers who would gain very little."
],
[
66.0,
"Set the slope to zero so everyone gains the same, and then all three numbers coincide."
],
[
71.0,
"Heterogeneity is what makes the LATE and ATE and ATT differ."
]
],
"multiple-iv": [
[
0.0,
"Very quickly, we have two generalizations here. First thing is what's the interpretation if we have multiple instruments."
],
[
6.8,
"With two instruments, each has its own Wald ratio for its own compliers. If we run two-stage least squares with both instruments, we are going to get a weighted average of the two with more weight put on the instrument with a stronger first stage."
],
[
22.8,
"So when two instruments give different answers, that's not necessarily a contradiction. They may just shift different people."
],
[
28.8,
"And can we use IV with covariates and what's interpretation in a potential outcome framework?"
],
[
36.8,
"If the instrument is only random within groups, then we assume independence given those control variable X."
],
[
43.8,
"Now each group has its own late and the two-stage least squares with covariates estimates a weighted average of them."
],
[
49.8,
"Now that's a pretty elegant optional result called Abadie's kappa."
],
[
56.8,
"We can interpret the weights to find the right compliers and with linear first stage, it's going to reproduce the two-stage least squares."
]
],
"py-late": [
[
0.0,
"Here's all of it in the code with the JTPA data. You can try it on your own."
]
],
"check-2": [
[
0.0,
"And lastly, three questions on IV and LATE."
]
],
"next": [
[
0.0,
"That's the end of this module, and also that's the end of all the asynchronous materials on this course."
],
[
7.7,
"Thank you for watching."
]
]
};
