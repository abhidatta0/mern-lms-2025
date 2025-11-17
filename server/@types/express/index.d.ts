import { InferSelectModel } from "drizzle-orm";
import { user } from '../../config/schema';

  declare global{
    namespace Express{
      interface Request{
        user: InferSelectModel<typeof user>;
        /*
          other variables (if needed)
        */
      }
    }
  }
    