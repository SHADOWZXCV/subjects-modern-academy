# subjects-modern-academy
This is a semester subjects organizer.

![image](https://github.com/SHADOWZXCV/subjects-modern-academy/assets/34347098/6df9a1e9-308f-4305-8334-d2111c0e569c)
It organizes the subjects in a table by **their relation to each other**.

For implementation details, head to [this section](#implementation-details).

Try it out live [here](https://shadowzxcv.github.io/subjects-modern-academy/).

## Features
- Choose your specialization and the table will be loaded with your subjects.
- When you move the mouse on a subject, it highlights:
  1. The subject/s that unlocks the current subject, if any.
  2. The subject/s that are unlocked after taking the current subject, if any.
  3. The current subject itself.
- Search & highlight a subject by code.
- Hold highlight.
- Click on a subject to show its details and any information related to it.

# Implementation details
1. I used what I call a "Mirected Graph" data structure, which is essentially a directed graph that can also be undirected.
2. This allows me to link related subjects together by their relation ( either required or dependent on the relation ) using a "weight" of either 1 or 2.
![image](https://github.com/SHADOWZXCV/subjects-modern-academy/assets/34347098/d62b663d-d6ed-4fd2-b7ab-ac06fd07b9de)

3. Tables are filled column by column, instead of row-by-row, as we're unloading the JSON arrays to the table by semesters, not by row!

# Development and contribution
This project is aimed to solve a very simple problem: ambiguity of subjects relationships.
However, if you would like to add any feature that helps within the scope of university students issues, you are more than welcome to do so!


## Rules for contribution:
1. Any changes or features are only submitted by making *a new branch*, and to be merged using *pull requests*
2. To add a new feature, simply make a new branch named: `feature-<name_of_feature>`, for bugs and/or suggestions, make the branch's name: `issue-<name>`
