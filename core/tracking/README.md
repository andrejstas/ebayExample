Tracking Module
===============
This module manages tracking of the user in the system. It can track for example:
- detecting a page view
- clicking on a certain button
- opening a dropdown
- selecting a certain option in the dropdown
- checking a checkbox

Implementation
------------------
- Firstly the module connects to the Matomo server. 
- Then it downloads the user's roles from the REST API.
- Page views are automatically tracked in the saga `trackPageViewSaga`.
- All events are defined in `./configuration`. Tracking of the events is based on listening to a certain fired `actions`. It allows defining
of various events without touching code in other places.
- It is also possible to track a custom event and page view at the same time.
