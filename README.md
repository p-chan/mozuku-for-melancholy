# mozuku-bot

> A simple helpful robot for melancholy channnel

# Usage

Copy `.env.example` to `.env` .

```
cp .env.example .env
```

Add slack token.

```.env
SLACK_TOKEN=xoxb-XXXXX
```

Start mona-bot.

```bash
$ npm start
```

Deploy to now. If [now](https://github.com/zeit/now-cli) is not installed, run `$ npm i now -g` .

```bash
$ now
```

Set alias.

```bash
$ now alias
```

Scaling new instance.

```bash
$ now scale NEW_INSTANCE 1
```

Delete old instance.

```bash
$ now rm OLD_INSTANCE
```

# License

The MIT License. See [LICENSE](LICENSE).
