1. Login page for Election commission and voters (/login)
2. Vote page for voters (/vote)
3. Results page for Election commission (/result)
4. Display results only when voting phase ended, else show error/nothing
5. Using HttpClient, need Proxy to get around CORS exception, proxy-conf.json
6. If voted/ already voted, log out automatically (/home)
7. Using service to send login data/ receive results data. Implement the service response handling at frontend-side.
8. Need to pass the token from one router to another, when logged in successfully and when voted successfully