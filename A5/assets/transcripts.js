// Transcripts of the voice-over, auto-generated from the recordings (faster-whisper large-v3-turbo).
// Written by ../../insert_recordings.py. Times are seconds into each slide's clip.
window.TRANSCRIPTS = {
"title": [
[
0.8,
"Welcome to this module on staggered rollouts. In the live sessions on difference-in-differences and event studies, a change hits some units and not the others, and then we compare their paths."
],
[
14.3,
"In practice, most changes don't arrive everywhere at the same time. They gradually roll out. There's a few cities first, then more cities, and then the rest."
],
[
23.8,
"This module is about how to analyze such rollouts. We'll see which comparisons are fair, why the familiar regression approach might give a misleading answer, and what are the modern tools that people suggest."
],
[
38.1,
"I'm also going to talk a few, two of my own research projects as an example."
]
],
"how-to": [
[
0.0,
"A quick word on how to use this page. As before, every slide has its own voiceover. You can go at your own pace and the transcript is under each slide. On the try-it slides, you'll pick a wave and a month to see who counts as a fair comparison and you can make simulations as you like."
]
],
"roadmap": [
[
0.0,
"This module has four parts. Part one shows the difference in differences, a quick recall in one picture, and the regressions we usually use to analyze difference-in-differences. Part two shows most changes are rolled out in waves with a few examples. Part three is why some regular regressions can make wrong conclusions. And part four shows some modern tools to avoid the problem."
]
],
"did-recap": [
[
0.4,
"Let's start with this picture. We have two groups, two periods. The treated group's outcome rises from before to the after, but part of that rise would have happened anyway. Think about macroeconomic shocks."
],
[
13.8,
"The comparison group tells us how much that shock is. Each change stands in for what the treated group would have done without the change, and that is a dash line."
],
[
25.3,
"The effect is the difference between the two changes, and hence the name difference-in-differences."
],
[
31.8,
"And the assumption is parallel trends. Essentially, without a change, the two groups would have moved together."
],
[
38.8,
"Their levels can differ, their trends cannot. You can click the second button to see what happens when the comparison group's trend is different."
],
[
48.3,
"Then the estimate is going to absorb part of the gap."
]
],
"one-number": [
[
0.0,
"In practice, we run difference-in-differences as a regression. The outcome equals a constant for each unit, plus a constant for each period, plus beta times a dummy for being treated after the change has started."
],
[
12.9,
"The unit constants absorb permanent differences between units. The period constants absorb shocks that hit everyone at once, like seasons or economy."
],
[
23.6,
"With two groups and two periods, beta is exactly the difference-in-differences from this picture."
],
[
30.0,
"With many units and periods, this is a standard way to run DID, often called a two-way fixed-effect regression, one line of code, and you get the number."
],
[
39.9,
"Now keep one question in mind for the rest of the module. When units start treatment on different dates, which comparison is this one number made of?"
]
],
"everywhere": [
[
2.4,
"Most changes don't arrive everywhere on the same date. In the policy setting, U.S. states expanded Medicaid in quite different years, and also minimum wages rise state by state."
],
[
15.3,
"In the example you'll see, in China, they gave electric cars green license plates city by city, and also the healthcare setting, China's public insurance adds new drugs in yearly negotiations."
],
[
28.0,
"And we're going to study the last two in detail."
],
[
30.2,
"In the business, it's a norm."
],
[
33.5,
"Ride-hailing and delivery apps launch city by city."
],
[
37.0,
"Remodels and new stores formats reach stores in waves."
],
[
40.8,
"A new feature usually ships country by country, and a new pay plan reaches one sales region at a time."
],
[
47.8,
"Each wave is sort of a small difference in differences on its own."
],
[
52.4,
"The question for this module is what happens when we want to pool all the waves into one regression."
]
],
"why-waves": [
[
0.0,
"Why do organizations roll things out in waves? Usually because they have to. There's a capacity reasons, like training staff and hiring drivers can take time. There's also risk. We want to launch in small pilot cities to see what breaks and then expand. And lastly, there are also permissions. Regulators, franchisees and local governments, you need to get approval usually one at a time."
],
[
25.7,
"For the analyst, waves are sometimes a gift. Every wave serves as a comparison for the waves still waiting."
],
[
36.2,
"A national shock like a season or recession cannot line up exactly with every launch date. So you can check whether the early and late waves respond the same way."
],
[
48.0,
"One piece of advice for the managers, if you have to roll out gradually anyway, randomize the order."
],
[
54.3,
"Then the comparison of launched and not yet launched markets is also a free experiment."
]
],
"green-plates": [
[
0.0,
"Here's the first example from the project of mine and Jinyang Zheng, who is also an assistant professor at Simon School."
],
[
7.7,
"In 2016, electric vehicles were under 2% of new car sales in China, despite pretty generous subsidies."
],
[
16.0,
"In December 2016, new EVs started to get a more salient green license plate instead of the standard blue one, and that policy was first piloted in five cities."
],
[
30.0,
"Now you can click through the maps. By late 2017, about 80 more cities had joined."
],
[
35.8,
"In 2018, provinces added cities month by month, until nearly the whole country had green plates by December."
],
[
43.8,
"The plates cost almost nothing to the government, and they come with no additional perk."
],
[
50.8,
"But it only makes EVs more visible on the street."
],
[
54.8,
"The question is, does this additional visibility increase the adoption of the cars?"
],
[
60.5,
"And also note the design. Every city has its own adoption date, so this is a typical staggered rollout."
]
],
"clocks": [
[
0.0,
"This chart summarizes the rollout shape in a simulated panel built to look like the real one."
],
[
6.0,
"We have a handful of pilot cities in December 2016, a big wave at the end of 2017, then a steady stream through 2018."
],
[
17.0,
"As in the live session on the event studies, we can line cities up by their own clock, month since adoption, where month zero is going to be that city's particular adoption month."
],
[
28.0,
"And you also can notice the cumulative line. Almost every city is eventually treated. By the end of 2018, almost the entire nation has adopted this new green plate policy."
]
],
"drugs": [
[
0.0,
"The second example is my work with Panle Barwick and Ashley Swanson, before 2016, China's public health insurance didn't cover most innovative drugs, for example, the leading cancer therapies were excluded."
],
[
14.0,
"In other words, if patients want to seek care using the public health insurance plan, they have to buy those cutting-edge cancer drugs entirely out of pocket and pay the full price."
],
[
29.0,
"Because they are so expensive, not many people could afford those innovative drugs."
],
[
35.0,
"And that led to the big public backlash, and eventually the reform, called the National Reimbursement Drug List Reform."
],
[
44.0,
"Starting in 2017, the government negotiates prices with drug manufacturers for new innovative drugs."
],
[
53.0,
"If the negotiation succeeds, the drug is going to be sold at a lower price, but also it's going to be covered by the National Insurance Plan."
],
[
62.0,
"So you see, this is a staggered rollout, instead of across different places, but here's a staggered rollout across different drugs."
],
[
70.0,
"Drugs enter yearly waves from 2017 to 2022, and some drugs never enter the formulary because the negotiation fails."
],
[
80.0,
"The comparison group is going to be the drugs that were eligible for negotiation, but did not negotiate it yet, or not successfully negotiated yet."
],
[
90.0,
"And we can observe the outcome, such as drugs price and quantity sold, and the research question is whether that inclusion of the national formulary affects drug pricing and drug sales."
],
[
103.0,
""
]
],
"controls": [
[
0.3,
"So in a rollout, who can serve as a comparison? Here in this example, we plot 12 stylized cities. Each row is a city, each column is a month, and orange cells are the treated time. You can pick a wave and a month after it started."
],
[
16.9,
"The cities outlined in green are fair comparisons. In the months that they haven't been treated yet, or never will be, so their paths show what happens without such change, without the treatment."
],
[
30.3,
"The cities outlined in red were treated earlier. Their outcomes are already being moved by the treatment and may keep moving because of the treatment."
],
[
40.4,
"In some sense, they are forbidden as a comparison and shouldn't be used as a control group."
],
[
46.9,
"You can move the month to the right and watch how the fair group, the green box, shrink."
],
[
53.5,
"Late in the rollout, almost every city is treated, and there's little left to compare with."
]
],
"trap": [
[
0.0,
"Now moving to the regression analysis, why the one-number regression is not a fair comparison."
],
[
6.8,
"I'm not going to show you the math, but here's a quick intuition."
],
[
10.8,
"Behind the scenes, this number compares every unit with every other unit whose treatment started at a different time in both directions."
],
[
20.6,
"Some of those comparisons are fair, the green groups I showed you in the previous slide, the early waves against the units that's not yet treated."
],
[
30.7,
"But some comparisons are forbidden, those are the late waves against the early waves, after the early waves was already treated."
],
[
40.2,
"Now why does that matter?"
],
[
42.2,
"If the effect is immediate and it's the same everywhere, the early waves just shift up once and become steady afterwards, the shift sort of cancels out and no harm is done."
],
[
54.0,
"But if the effect builds up over time, the early waves keep rising because of the treatment."
],
[
60.0,
"If we use early waves as a comparison, that rise looks like a common trend, and it's going to be subtracted from the late wave's effect."
],
[
70.2,
"But in reality, that trend is not the common trend, it's a trend due to the treatment."
],
[
75.6,
"And therefore, that one number we estimate in the regression can be far too small or even be the wrong sign."
],
[
84.1,
"So let's see how the bias looks like."
]
],
"two-waves": [
[
0.0,
"Suppose there are two waves of units. The early wave starts in period four, the late wave starts in period nine. Without treatment, both would rise along the dashed lines. The effect starts at one and with the slider at one, it grows by one more each period after a wave starts."
],
[
20.0,
"Now the true average effect is about four. The one number regression says almost zero."
],
[
27.0,
"Click a fair comparison, the early wave against the late wave before the late wave starts. That gives three close to the early wave's true effect."
],
[
38.0,
"Now let's click a forbidden comparison, the late wave against the early wave, which is already treated and still rising. That says minus two."
],
[
48.0,
"When the late wave's true effect is plus two and a half, and the regression is going to give you the average of these two estimates."
],
[
57.0,
"Now move the slider to zero so the effect doesn't grow. If the effect doesn't grow, then everything agrees again."
],
[
64.0,
"And even making the forbidden comparison is not going to matter."
]
],
"when-worry": [
[
0.0,
"When should we worry the most about this issue? There are several cases. The first is when the effects builds up or fades over time, which is pretty common because people form habits over time, the words of mouth gradually spread, people learn from doing, and the initial novelty gradually wears off. The second scenario is when the effects differs by wave. For example, the pilot market may be also special."
],
[
28.4,
"The third case is when very few units are never treated, so your regression now leans very heavily on the forbidden comparisons, when we should not worry about it too much. This is when the effect is pretty immediate, and we are pretty certain it's going to be pretty much the same everywhere, or when we have a pretty large group that is left almost never treated."
],
[
53.2,
"But in many cases, you rarely know those things in advance, so that's why the modern tools in part four is really the default tool when we want to tackle this staggered rollout."
]
],
"gp-sim": [
[
0.0,
"Now let's go back to the green plates, our simulated panel shaped like this real rollout, we have 300 cities, 4 years of monthly sales, and an effect that starts at about 0.2 log points and grows for 8 months."
],
[
15.0,
"Now because we made the data up, we sort of know the truth, we can take a look at the green line, which is a true effect by months since adoption."
],
[
24.0,
"The green dots compare each wave only with cities not yet treated, and they sort of closely track the truth."
],
[
31.0,
"The red dashed line is what you get from the two-way fixed effect regression, you get 0.34, and the true average is 0.43."
],
[
41.0,
"So it understates the effect by about a fifth. And the reason is exactly because it uses already treated cities as comparisons, while their effects are still growing, so they are not really valid comparisons."
]
],
"check-3": [
[
0.9,
"Alright, here are three questions about fair comparison and forbidden comparisons."
]
],
"cs-idea": [
[
0.0,
"Now what about the fix? The fix is pretty simple in words. We just make fair comparisons, and then we take the average."
],
[
7.8,
"That is the idea of the method developed by two researchers, Callaway and Sant'Anna, often called CSDID."
],
[
15.1,
"There are three steps. Step 1, take one wave at one month at a time, say the cities adopted in December 2017, and the month of March 2018."
],
[
25.8,
"Now we compare the change since 2017, the month before they adopted, with the change of the cities not yet treated in March 2018."
],
[
36.2,
"That's one clean two by two, that's a building block. Step 2, we can repeat that for every wave and every month after it started."
],
[
45.4,
"Already treated cities never serves as a comparison, so we only build on those fair comparisons."
],
[
51.7,
"Step 3, we average the building blocks the way we want. We can by the month since adoption, which gives us the event study graph."
],
[
62.3,
"We can also aggregate by wave, which is going to give us a sense whether some pilot cities are more special, whether they have a different treatment effect."
],
[
71.8,
"Or we can just sum up and take the average as one number, but now that number is built only from the fair comparisons."
],
[
79.2,
"Because in step 2, we only keep those fair comparisons."
]
],
"tools": [
[
0.0,
"Callaway and Sant'Anna methods also have some relatives. The imputation approach learns the untreated trend from the untreated observations only and then predicts what treated units would have done and average the gaps."
],
[
13.0,
"Sun and Abraham run the event studies separately for each wave and then take the average. There's also a stack design building from one clean dataset per wave and then stacks them."
],
[
24.0,
"The details differ, but they share one rule. An already treated unit should not serve as a control group."
],
[
32.0,
"On the same data, they usually agree with each other and they disagree with the two-way fixed effect regression exactly because when the effects grow or when the effects differ by wave,"
],
[
43.0,
"the two-way fixed effect regression is going to utilize the bad variation existing in the data."
],
[
49.0,
"I'm not going to teach you those different tools, but it's nice to know."
],
[
54.0,
"And the good thing is that all those methods are available in R, Stata, Python, whatever languages you like,"
],
[
61.0,
"and you don't really need to build those methods by hand."
]
],
"gp-results": [
[
0.0,
"Here are the published results for the green plate. We used the Callaway-Sant'Anna approach, with the not-yet-treated cities as comparisons."
],
[
8.2,
"Before adoption, the estimates are flat and close to zero. Adopting cities weren't already on different paths before the adoption of the green plate."
],
[
17.9,
"After adoption, EV sales jumped by about a quarter of log points in the adoption month, that's about 25%, and keep rising towards half a log points or more by month six."
],
[
29.1,
"This is the effect that builds up, exactly the setting where we worried the one-number, two-way fixed effect regression could go wrong."
],
[
38.2,
"Overall, the effect is about 0.48 log points, roughly 60% more EV sales, and is the same with or without the pilot cities."
],
[
51.7,
"You might also wonder why does the figure stop at the six months? Because by the end of 2018, nearly every city had green plates, so we sort of lose all the fair comparisons."
]
],
"nrdl-results": [
[
0.0,
"Now move to the drug negotiations. These two event studies are again what we used in the paper. Here we compare the innovative cancer drugs successfully negotiated versus the eligible but not yet negotiated, again using the Callaway-Sant'Anna approach."
],
[
18.0,
"Time unit here is the quarters relative to the negotiation. On the left you see price drops at once about 0.8 log points and stays down. Retail price fell about 57% and out-of-pocket price dropped about 86% which I didn't show in the graph."
],
[
38.0,
"On the right you see the quantity jumps and keeps rising for six quarters and the increase is tremendous it's more than 10 times."
],
[
47.0,
"So patients and doctors we see the lower prices which makes the drugs much affordable and there's a huge market expansion."
],
[
55.0,
"And again the effect gradually builds up potentially because more accessibility for the patient to get the drug."
],
[
62.0,
"Also you can look at the pre-negotiation trend. You see the price and quantities were mostly flat and that makes the post coefficients much more reassuring."
]
],
"reading": [
[
0.2,
"So when you read an event study from a rollout, you should check five things."
],
[
4.8,
"First, the left side, is it flat before adoption? That's necessary, but it's not going to be a bulletproof test."
],
[
13.6,
"Your small pre-trend can sometimes hide inside wide intervals."
],
[
18.0,
"Second thing is the shape afterwards, you see a jump, a buildup or a fade."
],
[
23.0,
"A buildup or a fade warns you that one number regression would be likely misleading."
],
[
27.5,
"Third, where it stops."
],
[
30.4,
"The horizon ends when the fair comparison runs out, so don't extrapolate beyond when you lose all the fair comparisons."
],
[
38.3,
"Fourth, by wave, you can check whether early waves and late waves really differ in the treatment effect."
],
[
45.2,
"And lastly, if you report one number, build it from fair comparisons and say it that you only average on those fair comparisons."
]
],
"py-cs": [
[
0.2,
"Here's the whole idea in code on the simulated rollout. Feel free to try it on your own."
]
],
"check-4": [
[
0.2,
"And here are the three final questions on the modern tools dealing with staggered rollouts."
]
],
"summary": [
[
0.0,
"All right, let's wrap up. Most changes reach units at different dates, and each wave can be seen as a small difference in differences, with waves still waiting as natural comparisons."
],
[
14.1,
"Fair comparisons using units not yet treated or never treated. Units treated earlier shouldn't be used as a comparison because their outcomes are already shifted by the early treatment."
],
[
27.8,
"So the two-way fixed-effect regression is going to mix the forbidden comparisons, and when the effect builds up, fade, or differ by wave, that can be badly wrong."
],
[
39.8,
"The fix is to build the estimate only from fair comparisons and then take the average, just like Callaway-Sant'Anna approach."
],
[
47.7,
"And we saw it in two studies, the green plate study where EV sales build up over months and drug negotiations."
]
],
"next": [
[
0.1,
"That is the end of this module."
],
[
3.1,
"Thank you for watching."
]
]
};
