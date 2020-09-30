# Connection

```js
import { Model } from "mongojack";
Model.connect("mongodb://localhost", "dbname",  { useUnifiedTopology: true });
```

# Mongoose connection

> Connecting with existing mongoose collection

```js
import mongoose from "mongoose";
import { Driver, Model } from "mongojack";
class MyDriver extends Driver {
    get database() {
        return mongoose.connection.db;
    }
}

Model.driver = new MyDriver();
```

Next: [Define Model](model.md)
