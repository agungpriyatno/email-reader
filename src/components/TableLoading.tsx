import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

const TableLoading = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between place-items-center">
          <Skeleton className=" h-10 w-full bg-secondary" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Skeleton className=" h-10 w-full bg-secondary" />
              </TableHead>
              <TableHead>
                <Skeleton className=" h-10 w-full bg-secondary" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 0, 0, 0, 0].map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className=" h-10 w-full bg-secondary" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className=" h-10 w-full bg-secondary" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { TableLoading };
