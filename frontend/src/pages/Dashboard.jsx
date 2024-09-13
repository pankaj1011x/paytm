import { Appbar } from "../componets/Appbar";
import { Balance } from "../componets/Balance";
import { Users } from "../componets/Users";

export function Dashboard() {
  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  );
}
