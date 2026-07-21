# Sleep Calculator MVP Requirements

Version: v0.1

## 1. Project Positioning

Sleep Calculator is an English sleep planning website that helps users calculate a suitable bedtime or wake-up time based on sleep cycles, time to fall asleep, and a simple nightly routine.

The MVP should be lightweight, fast, and trustworthy. It should not claim to diagnose or treat insomnia or any sleep disorder.

Core promise:

> Not just when to sleep. Know how to wind down tonight.

## 2. Target Users

- Office workers planning tomorrow's wake-up time
- Students preparing for school, exams, or early classes
- People with irregular sleep schedules
- Users searching for a quick bedtime or sleep cycle calculator
- Users looking for simple, non-medical sleep habit guidance

Out of scope:

- Medical diagnosis
- Insomnia treatment
- Sleep apnea screening
- Wearable device analysis
- Long-term sleep coaching

## 3. Core SEO Strategy

Primary keyword:

- Sleep Calculator

Supporting keywords:

- Bedtime Calculator
- Sleep Cycle Calculator
- Wake Up Time Calculator
- What Time Should I Go To Bed
- What Time Should I Wake Up
- Sleep Routine Planner
- How to Get Better Sleep
- What Causes Lack of Sleep

The traffic strategy is to use `Sleep Calculator` as the main entry keyword, then differentiate with personalized wind-down routine planning.

## 4. MVP Pages

Required for v0.1:

- `/` or `/tools/sleep-calculator`
- `/guides/how-to-get-better-sleep`
- `/guides/what-causes-lack-of-sleep`

Later expansion:

- `/tools/bedtime-calculator`
- `/tools/wake-up-time-calculator`
- `/tools/sleep-cycle-calculator`
- `/tools/nap-calculator`
- `/tools/sleep-debt-calculator`
- `/tools/sleep-routine-planner`

## 5. Main Tool Modes

The calculator should support three modes:

1. I want to wake up at...
2. I want to go to bed at...
3. I want to sleep for...

The MVP should prioritize the first two modes.

## 6. Inputs

Required inputs:

- Wake-up time
- Bedtime
- Time to fall asleep
- Sleep goal

Optional inputs:

- Age group
- Caffeine timing
- Screen use before bed
- Nap today
- Desired wind-down routine length

Default assumptions:

- Time to fall asleep: 15 minutes
- Sleep cycle length: 90 minutes
- Adult sleep goal: 7 to 9 hours
- Wind-down routine length: 60 minutes

## 7. Outputs

The result should include:

- Recommended bedtime
- Recommended wake-up time
- Sleep cycle options
- Estimated sleep duration
- Time in bed
- Wind-down start time
- Screen cutoff suggestion
- Caffeine note
- Tonight's wind-down routine

Sleep cycle options:

- 4 cycles: about 6 hours
- 5 cycles: about 7.5 hours
- 6 cycles: about 9 hours

Recommendation rules:

- Prefer 5 cycles or the option closest to the user's sleep goal
- Mark less than 7 hours as short sleep for adults
- Mark longer options clearly

## 8. Calculation Logic

Calculate bedtime from wake-up time:

```text
bedtime = wake_up_time - sleep_duration - sleep_latency
```

Calculate wake-up time from bedtime:

```text
wake_up_time = bedtime + sleep_latency + sleep_duration
```

Calculate sleep duration:

```text
sleep_duration = cycle_count * 90 minutes
```

Default cycle counts:

```text
4, 5, 6
```

## 9. Personalized Wind-down Routine

This is the main differentiation from common sleep calculator competitors.

The routine should be generated from user inputs and show a practical timeline.

Example:

```text
9:45 PM - Dim the lights
10:00 PM - Stop scrolling or switch to low-stimulation content
10:15 PM - Take a warm shower or do light stretching
10:30 PM - Read, journal, or listen to calm audio
10:45 PM - Get in bed
11:00 PM - Estimated sleep time
```

Simple rules:

- If the user reports screen use before bed, add a screen cutoff suggestion
- If caffeine was used late, show a caffeine note
- If the user napped late, mention that sleepiness may be delayed
- If time to fall asleep is long, start the routine earlier
- If sleep duration is short, show a gentle warning

## 10. Main Page Structure

Recommended structure:

1. H1: Sleep Calculator
2. Short explanation
3. Calculator input area
4. Results area
5. Tonight's Wind-down Plan
6. How This Sleep Calculator Works
7. Sleep Tips
8. FAQ
9. Disclaimer
10. Sources

## 11. FAQ

Initial FAQ questions:

- What is a sleep calculator?
- What time should I go to bed?
- How many sleep cycles do I need?
- Is 7.5 hours of sleep enough?
- How long does it take to fall asleep?
- Can this calculator diagnose insomnia?
- What should I do if I can't sleep?

## 12. Competitive Differentiation

Observed competitor patterns:

- Many tools only calculate by 90-minute sleep cycles
- Some authoritative sites have strong trust but feel heavy
- Some calculator sites are fast but have weak design and weak trust
- Few tools combine cycle calculation with a personalized wind-down routine

MVP differentiation:

- Faster and cleaner than content-heavy health pages
- More trustworthy than thin calculator pages
- More actionable than a basic sleep cycle calculator
- Focuses on tonight's practical routine, not just the final time

## 13. Trust And Safety

The site must include a visible health boundary:

- This tool is for general sleep planning and education only
- It does not diagnose insomnia, sleep apnea, or any medical condition
- It does not replace professional medical advice
- Users with persistent sleep problems, severe daytime sleepiness, breathing issues during sleep, or other concerning symptoms should consult a qualified professional

Recommended language:

- Use "may help", "can support", and "general guidance"
- Avoid "cure", "treat insomnia", and "guaranteed better sleep"

## 14. Analytics

Track:

- Page views
- Calculator starts
- Calculator completions
- Selected mode
- FAQ interactions
- Result copy or save actions
- Average time on page
- Guide-to-tool click-through rate

Initial success signals:

- Calculator completion rate above 25%
- Average time on page above 90 seconds
- FAQ interaction above 10%
- Early SEO impressions for sleep calculator-related terms

## 15. Not In MVP

Do not build in v0.1:

- User accounts
- Long-term sleep history
- Wearable sync
- AI medical diagnosis
- Insomnia treatment plans
- Paid subscription
- Complex reports
- Multilingual pages

## 16. Phase 2 Ideas

- Sleep Debt Calculator
- Nap Calculator
- Student Sleep Planner
- Shift Worker Sleep Calculator
- Jet Lag Sleep Planner
- 7-day better sleep email plan
- Sleep habit score
- Shareable sleep plan

## 17. Reference Sources

- CDC sleep basics: https://www.cdc.gov/sleep/about/index.html
- CDC adult sleep duration data: https://www.cdc.gov/nchs/products/databriefs/db559.htm
- AASM adult sleep duration recommendation: https://aasm.org/advocacy/position-statements/adult-sleep-duration-health-advisory/
- Sleep Foundation sleep calculator competitor reference: https://www.sleepfoundation.org/sleep-calculator
- Pearson sleep calculator competitor reference: https://www.pearson.com/channels/calculators/sleep-calculator
