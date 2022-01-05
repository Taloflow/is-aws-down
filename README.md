# Is Us East 1 down?

There is no good way to tell if US East 1 is down. Current methods include asking around if others have issues or relying on Down Detector.
A solution to find if AWS East 1 is working is to run sample applications in the region and report on their uptime. This repo contains source code for the sample applications we run to generate our [monitoring dashboard](https://www.taloflow.ai/is-aws-down/us-east-1)

## Repo structure:

* _apps/voting_game_: [SQS + EC2 + DynamoDB voting game](apps/voting_game/)
* _apps/bezos_quote_generator/_: [EC2 Bezos Quote Generator](apps/bezos_quote_generator/)
* _apps/shade_generator/_: [Lambda Random Shade Generator](apps/shade_generator/)
* _cloud_monitor_: [Uptime monitoring tasks and metrics API](cloud_monitor/)
* _apps/frontend_: [Frontend app](apps/frontend/)

## Future plans and extensibility

The current plan is to monitor US-East-1 first but monitor more regions and cloud providers in the future - dozens of regions for GCP, Azure, AWS etc.