import random
import os
from functools import cache
from fastapi import FastAPI, Depends, Response
from fastapi.middleware.cors import CORSMiddleware


@cache
def get_book():
    with open('./invent_and_wander.txt', 'rt') as f:
        book = f.readlines()
        return [x.replace('\n', '') for x in book if len(x) >= 140]


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ['API_CORS_ORIGINS'].split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/quote')
def get_quote(response: Response, trim: bool=True, book=Depends(get_book)):
    response.headers['Cache-Control'] = ('public, max-age=1, s-maxage=1'
                                         ', stale-while-revalidate=120'
                                         ', stale-if-error=120')
    random_index = random.randint(0, len(book)-1)
    quote = book[random_index]
    r = quote[:140] if trim else quote
    return r.encode('utf-8')
