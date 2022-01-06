# Is AWS Down?

There is no good way to tell if AWS is down. Current methods include asking around if others have issues or relying on Down Detector.

A potential simple solution to find if AWS is up, or having service degredation is run sample applications in the region and report on their uptime and latency. 

This repo contains source code for the sample applications we run to generate our [monitoring dashboard for US East 1](https://www.taloflow.ai/is-aws-down/us-east-1). We then monitor the uptime of these services either through the AWS API, or making a request to the service directly.

## Repo structure:

* _apps/voting_game_: [SQS + EC2 + DynamoDB voting game](apps/voting_game/)
* _apps/bezos_quote_generator/_: [EC2 Bezos Quote Generator](apps/bezos_quote_generator/)
* _apps/shade_generator/_: [Lambda Random Shade Generator](apps/shade_generator/)
* _cloud_monitor_: [Uptime monitoring tasks and metrics API](cloud_monitor/)
* _apps/frontend_: [Frontend app](apps/frontend/)

## Future plans and extensibility

The current plan is to monitor US-East-1 first but monitor more regions and cloud providers in the future.
