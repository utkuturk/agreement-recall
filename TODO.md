- clean up logging statements in header
- get timed exp time to put up
- check the stims.
- sepwithN is not working.
    - think this has something to do with the Template rendering an array of strings, but the pcibex main function is a generator that only outputs at run time

**Note the change in blank screen timings, i think it's better to keep these short**: done
- trial should be like:
    1. asterisks
    2. SPR
    3. 300ms blank
    4. math
        - find way to randomly generate digits d1 and d2 s.t. d1+d2 <= 10
        - add a timer, maybe 2500ms?
    5. 300ms blank
    6. RECORDING... prompt
        - get nice filenames
        - timer, like 9000ms
        - button to move on

- s: edit stims down to 10-12 words
- s: add instructions for participants to say math aloud

- set up SONA credit granting system. we already have the url param ID, just need to put it in the confirmation url at the very end
