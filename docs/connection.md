# Connection

```js
import { Model } from "mongomodel";
Model.connect("mongo://localhost", "hellodb");
```

# Mongoose connection

> Connecting with existing mongoose collection

```js
import mongoose from "mongoose";
import { Driver, Model } from "mongomodel";
class MyDriver extends Driver {
    get database() {
        return mongoose.connection.db;
    }
}

Model.driver = new MyDriver();
```
