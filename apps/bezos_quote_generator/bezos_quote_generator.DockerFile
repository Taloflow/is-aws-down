FROM python:3.9
WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./bezos_quote_generator /code/bezos_quote_generator
COPY ./bezos_quote_generator/invent_and_wander.txt /code/invent_and_wander.txt

ENV API_CORS_ORIGINS https://taloflow.ai,https://www.taloflow.ai

ENV VIRTUAL_HOST us-east-1-quote-generator.taloflow.ai
ENV LETSENCRYPT_HOST us-east-1-quote-generator.taloflow.ai
ENV LETSENCRYPT_EMAIL anu@taloflow.ai

CMD ["uvicorn", "bezos_quote_generator.api:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers", "--workers", "4", "--timeout-keep-alive", "65"]
