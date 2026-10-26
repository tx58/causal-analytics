// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
1.0,
"Welcome to this module. In the live sessions, we discuss randomized experiments and why that's our gold standard. Flip a coin, compare the two groups, and the difference is a causal effect. That promise is real, but it comes with a fine print. In this module, we're going to discuss that fine print. What happens if randomization was not carried out as planned? What if people don't take the treatment they were assigned? What does an experiment on one group tell us about the other?"
],
[
31.0,
"And how do we know whether difference is just luck? For each problem, we're asked three questions. What does a naive comparison actually measure? Which real experiment ran into it? And what's the right fix?"
]
],
"how-to": [
[
1.1,
"A quick word on how to use this page. As before, every slide has its own voiceover, and you can go at your own pace, and the transcript is under each slide. There are several simulations to try. In last part, there's a little game with 8 units, where you shuffle the treatment labels yourself. That game is the whole idea of randomization inference, so you can try it."
]
],
"roadmap": [
[
0.0,
"This module has five parts. Part 1 sets up the vocabulary, internal and external validity. Part 2 asks whether the randomization actually worked and what to do when it was stratified or subverted. Part 3 is about non-compliance, people who don't actually take the treatment they were assigned. Part 4 is about external validity, does the result carry over to the real deployment? And part 5 is about inference, how to judge whether a difference is just luck."
]
],
"promises": [
[
0.0,
"Let's start with what random assignment promises. In the module on potential outcomes, we saw that the difference in means equals the average treatment effect plus two bias terms, and that random assignment makes both of them zero. That's a promise. But every word in it hides the condition. Random assignment. Was it actually carried out? Did anyone override it? And did the probability of treatment differ across groups? That's part two. Treatment. The treatment people actually got may not be the one"
],
[
30.0,
"they were assigned. That's part three. The average treatment effect. For which people, which version of the treatment, which setting, and over what period. That's part four. And estimates how sure can we be that the difference isn't just luck. That's part five."
]
],
"internal": [
[
0.0,
"Two pieces of vocabulary. The first is internal validity. A study is internally valid if the association it finds between treatment and an outcome is a causal effect for the people in the study in that setting. A well-executed experiment has internal validity by design. The coin decides who is treated, so nothing else can explain the difference. The whole question is what well-executed hides. Anything that the design fails to eliminate is a threat to internal validity."
],
[
28.6,
"And notice what losing internal validity means. A biased estimate, wrong on average, that's different from noise. A small experiment can be perfectly internally valid but at the same time imprecise. But a badly run experiment with millions of users can be precisely wrong."
]
],
"external": [
[
0.0,
"The second piece of vocabulary is external validity. Does the result hold beyond this experiment? Researchers usually break this into four dimensions."
],
[
9.1,
"Persons. The people in the experiment may be special. Volunteers, consumers who opt in, users in one country. Settings. A pilot in two cities where competitors don't react."
],
[
20.2,
"Treatments. The version built for the test may differ from what gets shipped. And the outcomes. Two weeks of clicks is not a one year of retention."
],
[
31.7,
"Experiments guarantee none of this. And know that losing external validity is not a bias inside the experiment."
],
[
37.5,
"The experiment answered its own question correctly. It's just the wrong question or the wrong interpretation in terms of the decision we are making."
]
],
"covid": [
[
0.0,
"Here's an example that shows both kinds of validity at once."
],
[
3.0,
"In the summer of 2021, four countries estimated how well the Pfizer vaccine protected against the Delta variant."
],
[
11.0,
"Same vaccine, same variant, same month. This estimates actually range from 64 to 88%."
],
[
18.0,
"Why so different? None of this study was an experiment."
],
[
22.0,
"Once a vaccine is available, getting it is a choice. Unvaccinated people may take more risks."
],
[
28.0,
"Older people were usually vaccinated first. Outbreaks hit some regions harder than the others."
],
[
35.0,
"And testing also differ. Israel tested every contact of a case,"
],
[
40.0,
"so it found mild infections among vaccinated people that other countries might miss."
],
[
46.0,
"The original randomized trial has none of these problems."
],
[
49.0,
"The original randomized trial is internally valid, but it was run in 2020."
],
[
56.0,
"That's the original strain, not the Delta variant."
],
[
59.0,
"So what's the original randomized trial says about the Delta variant,"
],
[
64.0,
"that raises the question of external validity."
],
[
70.3,
"So you see the observational study can have issues with your internal validity,"
],
[
76.3,
"while the randomized control trial, because it was done in a different setting,"
],
[
80.3,
"can raise these issues on external validity."
]
],
"checklist": [
[
2.6,
"Here's the checklist for the rest of the module. On the internal side, randomization that failed or was overwritten, randomization that differed across groups but was analyzed as if it didn't, and non-compliance."
],
[
17.5,
"On the external side, unusual participants, a pilot study that differs from how the real program is implemented, effects that could change after everybody is treated, and experiments that last too short."
],
[
31.8,
"And there's also the question of luck in the sense of whether the result is just by coincidence, which we'll discuss at the end."
],
[
40.8,
"For each item, we're going to ask three questions. What does the naive comparison measure? Which real experiment ran into it? And what's the right fix?"
]
],
"check-1": [
[
0.0,
"Three questions about vocabulary. Click the answer to see the explanation."
]
],
"balance": [
[
0.0,
"Now we're going to think about whether randomization actually worked."
],
[
5.0,
"The main tool is called the balance check."
],
[
8.0,
"If treatment was truly random, it's unrelated to anything about a unit, including any attributes measured before the treatment."
],
[
17.0,
"So the treated and control groups should look very much alike on age, past purchases, region, so on and so forth."
],
[
25.0,
"Unlike independence from potential outcomes, this is something we could test."
],
[
29.0,
"We can compare means of each of the variables at a time, or we can test all those variables jointly."
],
[
35.0,
"But be careful about what the test can tell us."
],
[
39.0,
"Imbalance is evidence that something went wrong in the procedure."
],
[
42.0,
"Balance, on the other hand, is not the solid proof that everything went right."
],
[
47.0,
"If treatment was assigned based on something we didn't measure, then the balance table can look perfect, but the estimate can still be biased."
]
],
"balance-sim": [
[
0.0,
"Here's a question that trips up a lot of analysts, how many significant differences should the balance table show if randomization worked perfectly?"
],
[
11.0,
"Now let's press run one experiment. Each experiment randomizes 2000 customers and compares the groups on 10 characteristics."
],
[
19.0,
"Every so often a row turns red, meaning a difference significant at 5%, but that can be purely by chance."
],
[
28.0,
"Now let's run a thousand experiments. About 40% of perfectly randomized experiments show at least one significant row."
],
[
37.3,
"That's 1 minus 0.95 to the 10th power."
],
[
43.7,
"Move the slider to check 30 variables. Now most perfect experiments show a star somewhere."
],
[
48.7,
"So one star in a balance table is not a failure. Look at the joint test and at whether the differences are large relatively to the outcome, I mean economically large."
],
[
59.7,
"In the résumé audit experiment from the class, one of 14 characteristics was significant, but the joint test was nowhere near rejecting."
]
],
"star": [
[
0.5,
"Let's look at a famous experiment. In the late 1980s, Tennessee ran a project called STAR. About 11,600 kindergartners in 79 schools were randomly assigned to small classes, regular classes, or regular classes with a teacher's aide. Teachers were randomized too."
],
[
20.5,
"Why run an experiment? Class size is the most expensive policy tool in education. Outside the experiment, small classes we observe are usually not randomly distributed."
],
[
32.5,
"They are more likely to appear in private schools. They tend to be in richer districts and they are usually assigned to struggling students."
],
[
40.5,
"Either way, as we discussed, a simple comparison between the small class versus the big class is going to deliver biased outcomes on education."
],
[
49.5,
"So that led to this important experiment. As one detail to remember, the randomization happens within each school, and we're going to see why that matters in a moment."
]
],
"star-balance": [
[
0.0,
"Here is the STAR balance table. Let's read it row by row and classify each row."
],
[
5.3,
"Row 1 to 3 are measured before the treatment. Free lunch status, race, and age. They are pretty balanced."
],
[
12.1,
"The three groups differ by only a point or two, and none of the joint tests reject at 5%."
],
[
17.9,
"Row 5 is the treatment itself. Small classes really were indeed smaller, by 15 students against 22."
],
[
25.9,
"Row 6 is the outcome. Children in small classes scored about 6 percentile points higher."
],
[
33.2,
"Row 4, the share of students who left the study, is different. It's called the attrition rate."
],
[
38.7,
"It's measured after the assignment, so it's not a balance check. It's a separate problem, which we won't cover here."
]
],
"star-estimates": [
[
0.1,
"And here is the regression table. Column 1 is a plain difference in means. Small classes add about 4.8 percentile points, with a standard error of 2.2. Column 2 adds school fixed effects, which we haven't explained, but you can think about they control the categorical variable of each school."
],
[
20.8,
"The estimates rise to 5.4 and the standard error nearly halves. As expected, STAR randomized within schools, so comparing within schools can remove more noises than differences between schools. And as we see next, it also leads to a smaller bias."
],
[
38.8,
"Column 3 and 4 add student and teacher characteristics. The small class estimate doesn't move, which is reassuring. These characteristics were balanced in the first place, so controlling them shouldn't matter."
],
[
50.8,
"The standard error shrinks a little more, that's also as expected. One more thing, free lunch has a big negative coefficient. That's not the effect of free lunches. It's just a predictor of scores."
],
[
62.8,
"Remember, in an experiment, controls are there just for the precision of the treatment variable and as a check. We don't want to interpret the control variables to give them any causal interpretations."
]
],
"conditional": [
[
0.6,
"That brings us to an important design detail. In a completely randomized experiment, everyone has the same chance of treatment. In a conditionally randomized, or sometimes called stratified experiment, the chance depends on the group of a unit belongs to, a school, a country, a store."
],
[
18.2,
"There are good reasons to do this. A school can only open so many small classes. A company may roll out a test to 50% of users in one country and 10% in another."
],
[
28.7,
"But here's a catch. If treatment share differs across groups, then treatment is correlated with group membership, and with everything that the group may predict."
],
[
40.4,
"That randomization is still real, but only within or conditional on each group."
],
[
46.6,
"If we pool all the groups and compare, then the treated group is overweighted towards the high share groups, and that comparison might be biased."
],
[
56.4,
"And that explains why in the previous regression, we would prefer to control for the school directly."
]
],
"stratified": [
[
0.9,
"Let's see the bias. There are two schools. School A is bigger and has higher baseline scores. And in School A, small classes help a lot. School B is smaller with lower scores and small classes help less. The true average effect is 6. School A put 80% of its students in small classes. School B only 30%."
],
[
24.8,
"Now look at the red bar. Pooling the two schools gives about 15 as the average treatment effect, which is more than twice as the truth. The treated group is mostly School A students, who scores high anyway. Within each school, the comparison is fine. A regression with the school dummy gets close, but it weighs the schools in a slightly odd way. So comparing within schools and averaging with school sizes get exactly 6."
],
[
52.7,
"Now drag the two sliders to the same value. The pooled comparison is fine again, because when every school has the same share, treatment is no longer related to school."
],
[
64.7,
"The rule here is that if we randomize within a group or a strata, we should always control for the group."
]
],
"minneapolis": [
[
0.0,
"Sometimes randomization isn't just stratified, it's overridden."
],
[
4.0,
"In the 1980s, Minneapolis police ran an experiment on how to respond to domestic violence calls."
],
[
11.0,
"They can arrest the offender, give advice, or order the offender to leave for 8 hours."
],
[
17.0,
"The assignment was random. Officers had pads of color-coded forms in random order, and they were supposed to apply whatever the top form said."
],
[
27.0,
"The paper compares the designed treatment in the columns with what was actually delivered in the rows."
],
[
34.0,
"Most cases on the diagonal, but officers upgraded 44 of the non-arrest cases to arrests, usually the most dangerous ones,"
],
[
43.0,
"when the offender refused to leave, when the weapons or alcohol were involved, or when the officer himself or herself was attacked."
],
[
52.0,
"So the group that was actually arrested contains the hardest cases."
],
[
57.0,
"Comparing outcomes by the treatment delivered brings selection bias back, and it makes arrests look less effective than it is."
],
[
65.0,
"The fix which Part 3 develops is to compare by the designed treatment instead of the actual treatment outcome."
]
],
"check-2": [
[
0.0,
"Three questions here."
]
],
"assign-receipt": [
[
0.0,
"Part three is about non-compliance and has one new piece of notation. Zi is the treatment the unit was assigned by the randomization, and Di is the treatment it actually received. Random assignment makes Z random. It does not make D random if people can deviate from their assignment, just like what Minneapolis police people did. Then receiving the treatment is a choice, and choices are related to potential outcomes."
],
[
30.0,
"There are two versions. With one-sided non-compliance, some people offer the treatment but don't take it, but nobody in the control group can get it."
],
[
39.0,
"A coupon that only the treatment group receives is an example of one-sided non-compliance. With two-sided non-compliance, the control group can also get the treatment."
],
[
50.0,
"In the Oregon Health Insurance Lottery, some lottery losers also got Medicaid anyway through other routes. That's the two-sided non-compliance."
]
],
"itt": [
[
0.3,
"The first and safest analysis is called intention to treat. Ignore what people actually did and compare outcomes by what they were assigned."
],
[
9.3,
"It's the same difference in means as in a perfect experiment, and it's unbiased because the assignment itself was random."
],
[
17.3,
"But be clear about the interpretation and what it estimates. That's the effect of being offered the treatment, including other people who ignored the offer."
],
[
28.3,
"For many business and policy questions, that's exactly what you want. For example, if you send only a coupon, you couldn't force people to use it."
],
[
37.3,
"So the ITT or the intention to treat tells you what sending the coupon does. If instead you want to know what the treatment does to the people who actually take it,"
],
[
48.3,
"then ITT would understate it because it's diluted by the people who got the treatment but didn't take it up."
],
[
55.3,
"And also keep in mind that take up depends on how the offer was made. So a different campaign would give a quite different ITT."
]
],
"types": [
[
0.0,
"To think clearly about noncompliance, it helps to sort people into four types based on what they would do under each assignment."
],
[
8.0,
"Compliers take treatment if assigned to it and not otherwise. Always takers take it no matter what. Never takers never take it no matter what, and defiers would do quite the opposite of the assignment."
],
[
20.0,
"And we assume none of the people are defiers. A person's type is like a potential outcome. It's fixed, but we never see it."
],
[
30.0,
"It's like a person's property or the person's attribute, because we can only see what they did under the assignment they got."
],
[
38.0,
"Now look at the table on the right. Because assignment is random, the mix of types is the same in both assignment groups."
],
[
46.0,
"But look at the treatment received. The untreated group contains compliers and never takers. The treated group contains compliers and always takers. Those are quite different people."
]
],
"as-treated": [
[
0.0,
"That's why the two very common analyses are biased. The first is called the as-treated. Compare everyone who received the treatment with everyone who didn't. That compares compliers plus always-takers with compliers plus never-takers. We are comparing different kinds of people."
],
[
16.2,
"Then we go back to the issue of observational study because we are doing a comparison of two observed groups without random assignment. where all the selection bias, we have worked so hard to remove, come back again."
],
[
29.2,
"The second is called per protocol. We keep only the people who did what they were assigned. Same problem: it selects on the choice made after the coin was flipped."
],
[
40.2,
"The bias can actually go either way. In Minneapolis, the arrested group had the most dangerous cases. So arrest looked worse than it was."
],
[
50.2,
"In a drug trial where sickest patients cannot tolerate the pill, the drug looks better than it is."
],
[
57.2,
"So the rule is never analyze an experiment by the treatment received. Compare by the treatment assigned."
],
[
64.2,
"And if you want the effect of the treatment itself, we can scale it up as we'll discuss next."
]
],
"late": [
[
0.0,
"So how do we get the effect of treatment itself? We need two assumptions. First, monotonicity. Essentially, there are no defiers. Being offered the treatment never makes someone less likely to take it. This is a pretty reasonable assumption."
],
[
14.0,
"Second, exclusion. The assignment affects the outcome only through the treatment. In other words, getting a lottery letter doesn't change your health, except by getting you an insurance."
],
[
26.0,
"In the diagram, U stands for everything unobserved that drives both take-up and the outcome. Randomization means U doesn't affect Z. Exclusion rules out the dashed arrow from Z straight to Y."
],
[
41.0,
"With these assumptions, the effect of the treatment on complier equals the intention to treat effect divided by the first stage. First stage defined as the difference in take-up between the two assignment groups."
],
[
55.0,
"We call it also the local average treatment effect or LATE. L-A-T-E."
]
],
"ratio": [
[
0.0,
"Why does that ratio work? Split the intention to treat the effect by type. Always takers get the treatment whether or not they are offered, and never-takers never get it. So under exclusion, the offer does nothing to either group. All of the ITT comes from the compliers, but they are diluted by their share in the population."
],
[
21.2,
"In the first stage, the difference in take-up between offered and the control group is exactly the share of compliers. Divide one by the other, you get the effect on compliers."
],
[
34.2,
"A quick example, a coupon raises purchase by two percentage points in the offered group, and half of the offered group use the coupon, and 10% of the control get a coupon anyway."
],
[
47.2,
"Then the effect on compliers is 2 divided by 0.5 minus 0.1, that's 0.4, or 5 points."
],
[
56.2,
"Now notice the word local. This is the effect for people this particular offer moved, not for everybody."
]
],
"nc-sim": [
[
0.0,
"We will come back to the LATE concept when we talk about the instrument."
],
[
4.8,
"Now let's put the five estimators side by side."
],
[
8.3,
"In this experiment, half of the people are compliers, and the true effect on compliers is four."
],
[
14.7,
"Always takers would have high outcomes anyway, and never takers low outcomes."
],
[
19.0,
"The blue bar, the ITT, is two."
],
[
22.1,
"The effect of four diluted by the 50% compliers' share."
],
[
27.1,
"The first stage estimates that share."
],
[
28.9,
"Their ratio, the green bar, lands exactly on four."
],
[
32.4,
"The two red bars, as treated and per protocol, are way too big, around 17 and 13, because"
],
[
39.0,
"they get comparing different types of people."
],
[
41.9,
"Now play with the sliders."
],
[
43.6,
"Lower the share of the compliers, the ITT shrinks, but the ratio stays at four."
],
[
49.4,
"Turn down how different the compliers are."
],
[
52.6,
"The red bar comes down towards the truth."
],
[
54.6,
"We are only right when nobody selects into the treatment, and that's exactly what we cannot count on."
]
],
"oregon": [
[
0.4,
"A useful special case is one-sided non-compliance, where nobody in the control group can get the treatment, and there are no always-takers."
],
[
9.4,
"The first stage is just the share of the offered who took it up, and the compliers are exactly the people who were treated."
],
[
16.4,
"The ratio gives the effect on the treated. Here's a real example, the Oregon Health Insurance Lottery, which we discussed in class."
],
[
24.4,
"Meaning that the Lottery raised Medicaid coverage by about 25 percentage points, and emergency room use by 1.7 points."
],
[
33.4,
"Dividing gives the effect of Medicaid on the people the Lottery moved into Medicaid. That's about 7 percentage points more ER visits on a base of 35%."
],
[
46.4,
"I do want to point out, this interpretation is correct if and only if the Oregon Health Insurance Lottery is one-sided non-compliance."
],
[
57.4,
"In fact, Oregon was actually two-sided, because some of the losers could also get Medicaid anyway."
],
[
64.4,
"So, this interpretation is only correct if the Oregon experiment was one-sided non-compliance."
]
],
"itt-late": [
[
0.3,
"To summarize which should we report, usually we can report both ITT and LATE because they answer quite different questions."
],
[
8.3,
"The ITT tells you the effect of offering the treatment to everyone assigned and needs only random assignment."
],
[
14.3,
"The LATE tells you the effect of actually receiving the treatment for compliers and it needs two extra assumptions."
],
[
21.3,
"There is a price in precision. The LATE standard error is roughly the ITT standard error divided by the first stage."
],
[
27.3,
"If only 10% take up the treatment, the standard error is also going to be 10 times bigger."
],
[
33.3,
"So low take up is going to hurt both numbers."
],
[
36.3,
"The fix is in the design, we want better onboarding, default reminders."
],
[
40.3,
"No analysis can rescue experiments where almost nobody is going to actually took the treatment."
],
[
47.3,
"Another thing is that to compute LATE, we also need to have the first stage estimate, meaning we need to be able to say the take up ratio,"
],
[
56.3,
"which is often times missing in the data and therefore we can only resort to ITT."
]
],
"py-nc": [
[
0.8,
"Here is the same experiment in code. We draw each person's type and let the treatment received depend on the type. Then we compute the five estimators we discussed. You can try to make non-compliance one-sided by removing the always-takers and see the ratio between the ITT and the first stage is going to give you the effect on the treated."
]
],
"check-3": [
[
0.5,
"Here are three questions on non-compliance to test your understanding."
]
],
"persons": [
[
2.5,
"Part 4, we move back to external validity, starting with the people in the experiment."
],
[
7.5,
"Experiments need participants, and participants are rarely a random sample of the people we care about."
],
[
13.5,
"They're usually volunteers, they agree to take part, the consumers who opt in, stores and managers who cooperate."
],
[
20.5,
"The estimate is valid for them, if the effect depends on whatever makes them special, it won't carry over."
],
[
26.5,
"And exclusions made to protect internal validity also has a cost."
],
[
31.5,
"For about 15 years, the U.S. FDA Food Drug Administration recommended keeping women who could become pregnant out of early drug trials."
],
[
40.5,
"That makes the trials cleaner, but it left two decades of drugs with little evidence on how they work for younger women."
]
],
"pilot": [
[
0.0,
"Next, the treatment and the setting. A pilot is usually run by people who designed it, with extra money and close monitoring. When the program scales up, a different team runs it on a smaller budget. In fact, it's quite different in the treatment."
],
[
14.2,
"Then there are general equilibrium effects. Treating 2% of the market changed nothing around it. Treating everybody would change the entire market. For example, a job search program in France helped treated job seekers find work faster."
],
[
27.8,
"But partly by taking jobs that untreated job seekers would have taken. At full scale, the net effect would be much smaller if no new jobs are created."
],
[
37.8,
"A discount tested on 5% of users won't make a competitor respond. A permanent price cut were more likely to make people respond. And the status badge may work only if it's rare."
],
[
51.8,
"So you have seen this before. In a short video platform case, a test that held creators fixed missed how creators responded."
]
],
"horizon": [
[
0.5,
"Third, the horizon. Most experiments are short, so they measure short run effects. A new page layout may get more clicks just because it's new, or fewer because users haven't got accustomed to it. Both effects may fade."
],
[
15.0,
"The outcomes we really care about, like retention, lifetime value, health, usually lie way beyond the test window. So the experiment measures a proxy, and what the proxy predicts the real outcome is an assumption."
],
[
27.5,
"But what can we do? We can plot the effects over time, we don't stop at the first week, and when the long run really matters, we can keep a so-called holdout sample, a small group that stays untreated for months after launch, so you can measure the long run effect directly."
]
],
"reweight": [
[
0.4,
"There's a partial fix for the problems called re-weighting. If the effect differs across groups we can observe, and the target population has a different mix of those groups we are interested in, we can average experiment's group-level effects using a target mix."
],
[
16.4,
"To give you an example, the experiment was 70% new customers, but the market is potentially 30% new customers. The effect is going to be 4% for new customers and 1% for existing customers."
],
[
28.4,
"The experiment's average is 3.1, but that's re-weighted to the market. The true market is going to make the treatment size 1.9."
],
[
39.4,
"But we should know the limits. Re-weighting can fix differences in people that you observe and the experiment covers."
],
[
46.4,
"It does nothing for differences in settings, treatments, or horizons, and for differences we cannot measure."
]
],
"tradeoff": [
[
0.5,
"All of this adds up to a trade-off. The more tightly you control experiments with simple subjects, a short one, one city, nothing else changing, the cleaner it estimates."
],
[
9.5,
"But less it looks like the world we're actually in. Every fix for internal validity can push us away from the real world."
],
[
17.5,
"Every demand for realism pushes us towards the field, but away from the lab."
],
[
23.5,
"There's no formula for the right balance, but there's an honest way to report the results, see which population, which version of the treatment, which setting, and which horizon we have measured, and which of those could change at scale."
],
[
35.5,
"And in practice, two experiments often beat one, a small clean one to establish that the effect is real, and then a larger, messier one, or a staged rollout to measure where it matters."
]
],
"check-4": [
[
0.6,
"Here are three questions about your understanding on external validity."
]
],
"uncertainty": [
[
0.0,
"The last part is about the uncertainty. How do we know a difference is not just by chance?"
],
[
7.0,
"In a regression view, which you learn first, our data are a random sample from a big population,"
],
[
13.0,
"and the standard error describes how much the estimate would change under a different sample."
],
[
18.0,
"In an experiment, there is a different view of the uncertainty."
],
[
22.0,
"The units are what they are, every store, every user. What was random is which of them got treated."
],
[
28.0,
"So the question can also become how much would the estimate change if the coin had landed differently,"
],
[
35.0,
"such that some units are put in the treated group instead of the control."
],
[
40.0,
"That view leads to a beautifully simple test called randomization inference."
],
[
46.0,
"It doesn't need a formula, no assumption about the shape of the data, and it's exact in any sample size."
],
[
53.0,
"It doesn't require to send the sample to infinity, and let's see how it works."
]
],
"shuffle-idea": [
[
0.5,
"Here is the whole idea in three steps."
],
[
3.8,
"Step 1, suppose a treatment did nothing at all to anyone."
],
[
7.5,
"Then each unit would have exactly the same outcome, whether it was labeled, treated, or controlled."
],
[
13.4,
"Then the labels or the treatment assignment would be entirely arbitrary."
],
[
18.0,
"Step 2, if the labels are arbitrary, we could just shuffle them."
],
[
21.2,
"You can keep every unit's outcome where it is, randomly assign who is called treated, and recompute the difference in means."
],
[
29.1,
"That's the difference we would have seen if coin had fallen differently."
],
[
34.4,
"Step 3, do that for every possible shuffle, or for thousands of random ones."
],
[
39.8,
"The p-value is simply the share shuffles that produce a difference at least as large as what we observe in the real world."
],
[
46.7,
"If such large difference almost never happened by shuffling, it's hard to believe that the treatment did nothing."
],
[
53.9,
"Let's try it with 8 units."
]
],
"eight-units": [
[
0.7,
"Here are 8 units where there are observed outcomes. In a real experiment, unit 1 to 4 were treated. The treated average is 8, the control average is 2, so the difference is 6. The question is that, is 6 a lot or are we just by chance?"
],
[
15.7,
"If the treatment did nothing, any 4 units could just as well have been the treated ones. Click on the unit to try to give them another assignment. Make sure exactly 4 are treated, and the page is going to compute the difference."
],
[
32.7,
"Then press shuffle the labels a few times. Each shuffle is going to add a bar to the chart."
],
[
39.7,
"There are only 70 ways to choose 4 units out of 8, and we can actually check them all. Press show all 70."
],
[
47.7,
"The red bars are the assignments that give a difference of 6 or more in either direction. There are 6 of them."
],
[
56.7,
"So the p-value is 6 out of 70, about 0.09, not quite significant at 5%."
],
[
63.7,
"Interestingly, the usual t-test on the same 8 numbers says about 0.04. With only 8 skewed numbers, the approximation is not as reliable, and the count of shuffles is probably a more reliable inference."
]
],
"resume": [
[
0.9,
"The same test on the real experiment, the résumé audit from the class."
],
[
5.9,
"Researchers sent about 4,900 fictitious résumés to employers with names randomly chosen to sound white or black."
],
[
14.9,
"White-sounding names got callbacks 9.65% of the time, black-sounding names 6.45%, a gap of 3.2 percentage points."
],
[
25.9,
"The sharp null here is that the name changed no employer's decision."
],
[
29.9,
"If that were true, the names would be arbitrary labels, so let's just shuffle them."
],
[
35.9,
"Let's shuffle 20,000 times."
],
[
37.9,
"The green histogram shows a gap we get by chance."
],
[
41.9,
"They cluster around zero and rarely go beyond two points."
],
[
46.9,
"The real gap, the orange line, is far out in the tail."
],
[
53.5,
"In 20,000 shuffles, a gap that's large appears once at most, often not at all."
],
[
61.5,
"The p-value is well below 1 in 1,000, the same verdict as the regression."
],
[
66.5,
"Notice also that the spread of the shuffle gaps matches the regression standard error."
],
[
72.5,
"With 1,000 units, the two inference approaches will agree."
],
[
76.5,
"Now switch to a random 200 résumés and shuffle again."
],
[
79.5,
"With a small sample, the two p-values can differ and the shuffle one is going to be the exact one."
]
],
"clusters": [
[
0.0,
"On the last point, and the shuffle idea, often treatment is assigned to some groups, like stores, cities, schools, or weeks. Then a coin is flipped once per group. Suppose 20 stores were randomized and you have millions of transactions. There were only 20 coin flips. So a regression that treats each transaction as an independent observation, we think we have millions of pieces of evidence. And it will report standard errors that's far too small."
],
[
27.6,
"The shuffle test can handle this more naturally. We have just shuffled the stores, not the transactions, because that's what the coin decided. That's how the treatment is assigned."
],
[
38.6,
"In the regression, there's also a fix, which is called clustering standard errors at the level of randomization, which you'll probably see in the homework on difference in differences."
],
[
51.0,
"The rule is quite simple. Analyze at the level at which treatment was assigned."
]
],
"py-ri": [
[
0.4,
"And here's how it works in the code. The first part loops over all 70 assignments of 8 units and counts how many give a difference as large as 6. The second part rebuilds resume data from the callback counts, shuffles the names 20,000 times, and counts how often a gap as large as 3.2 appears. A nice feature of reshuffling is that it works for any statistic. Try replacing the mean with a median. There's no simple standard error formula for the median difference, but the shuffle test just doesn't care."
]
],
"check-5": [
[
0.0,
"Three final questions on randomization inference."
]
],
"summary": [
[
1.3,
"Now let's wrap up with one-slide version of the module. If randomization was overwritten or stratified, the naïve comparison mixes the effects of this selection bias, the fix analyzed by the assigned treatment and control for the group."
],
[
15.3,
"With non-compliance, comparing by assignment gives intention to treat effect, diluted by the take-up ratio, while comparing by receipt is just an observational comparison."
],
[
26.3,
"Report the ITT, and if possible, divide by the first stage to get the effect on compliers."
],
[
32.3,
"By external validity, the experiment measures the effects of these people, this version of the treatment, this setting, and this horizon."
],
[
39.3,
"Say so, re-weight when you can, and use holdouts and staged rollouts."
],
[
44.3,
"And lastly, to judge whether the difference is by chance, we can reshuffle the treatment labels, especially when the sample or the number of clusters is small,"
],
[
52.3,
"and always analyze at the level at which the treatment was assigned."
]
],
"next": [
[
0.5,
"That's the end of the module, thanks for watching."
]
]
};
