import { PostgresRepo } from "./postgres";

export class TimescaleRepo extends PostgresRepo {
  constructor() {
    super(process.env.TIMESCALEDB_URL);
  }
}
