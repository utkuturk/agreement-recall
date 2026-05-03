- clean up logging statements in header

- sepwithN is not working: FIXED
    - previous sepwithN used main.pop() which ends up destroying this array (I think), which rshuffle doesn't seem to like, or since popping reverses the order somethign else weird happens. no real idea, but pushing from main to a new array seemed to work.

- get timed exp time to put up
- set up SONA credit granting system. we already have the url param ID, just need to put it in the confirmation url at the very end
