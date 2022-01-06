# Front End App

### Tech Stack
- Redux Toolkit
- Next JS
- Tailwind CSS
- Cloudflare Pages

### Project Structure

* [State and querying data is in /src/features](apps/frontend/src/features)
* [Components are in /src/components](apps/frontend/src/components)
* [Pages are in /src/pages/is-aws-down/](apps/frontend/src/pages)

### How to run locally

Run `npm install` and `npm run dev`

### Quirks

- All static files need to have fully qualified paths. We use a Cloudflare worker reverse proxy for our hosting on [https://www.taloflow.ai/is-aws-down/us-east-1](https://www.taloflow.ai/is-aws-down/us-east-1) because our site is hosted on Webflow.

```javascript
process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-scroll-up.gif"
```

### Contributing
All changes are welcome. If you're unsure something will be welcome, please open an issue.