import { useState, useRef, useMemo } from 'react';

import dayjs from 'dayjs';
import AceEditor from 'react-ace';
import { useVirtual } from 'react-virtual';
import relativeTime from 'dayjs/plugin/relativeTime';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CSVLink } from 'react-csv';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  CounterClockwiseClockIcon,
  ResetIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-tomorrow';

import { Button } from '@/components/ui/button';
import { QUERIES, DATA_LIST } from '@/constants';
import Separator from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

dayjs.extend(relativeTime);

function HomePage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const [queryData, setQueryData] = useState<Record<string, string | number>[]>([]);
  const [query, setQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<Array<{ query: string; dateTime: string }>>([]);

  const columns = useMemo<ColumnDef<unknown>[]>(
    () =>
      queryData.length
        ? Object.keys(queryData[0]).map((key) => ({
            accessorKey: key,
            header: key,
          }))
        : [],
    [queryData],
  );

  const table = useReactTable({
    data: queryData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: queryData.length,
    overscan: 10,
  });

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  const runQuery = (localQuery = '') => {
    const queryToExecute = localQuery || query;

    if (localQuery) {
      setQuery(localQuery);
    }

    if (queryToExecute) {
      const currentDateTime = dayjs().toISOString();
      setQueryData(DATA_LIST[queryToExecute] || DATA_LIST[QUERIES.customerAll]);
      setQueryHistory((prevQueryHistory) => [
        ...prevQueryHistory,
        { query: queryToExecute, dateTime: currentDateTime },
      ]);
      toast({
        duration: 2000,
        description: (
          <div className="flex items-center justify-between gap-2">
            <CheckCircledIcon className="text-lime-500 bold h-5 w-5" />
            <p>Query was executed successfully</p>
          </div>
        ),
      });
    } else {
      toast({
        duration: 2000,
        description: (
          <div className="flex items-center justify-between gap-2">
            <CrossCircledIcon className="text-red-500 bold h-5 w-5" />
            <p>Oops, please enter something</p>
          </div>
        ),
      });
    }
  };

  return (
    <div className="h-full flex-col">
      <div className="container flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold">SQL-Playground</h2>
      </div>
      <Separator />
      <section className="container mt-2">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Card className="flex-[70%]">
            <CardContent className="p-0">
              <div className="flex w-full justify-between items-center">
                <p className="font-bold text-center text-sm py-4 w-28 bg-gray-100 rounded-tl-xl">Input</p>
                <div className="flex items-center space-x-2 mr-2">
                  <Button onClick={() => runQuery()}>Run</Button>
                  <Button
                    variant="outline"
                    tooltipText="Reset"
                    onClick={() => {
                      setQuery('');
                      setQueryData([]);
                    }}
                  >
                    <ResetIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              <AceEditor
                className="rounded-b-xl h-64"
                aria-label="editor"
                mode="mysql"
                theme="tomorrow"
                name="editor"
                width="100%"
                fontSize={16}
                minLines={40}
                maxLines={16}
                showPrintMargin={false}
                showGutter
                placeholder="Hey!! You can query the data here"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  wrap: true,
                }}
                value={query}
                onChange={(value) => setQuery(value)}
              />
            </CardContent>
          </Card>
          <Card className="flex-[30%]">
            <CardContent className="p-0">
              <div className="flex w-full justify-between items-center">
                <p className="font-bold text-center text-sm py-4 w-28 bg-gray-100 rounded-tl-xl">Queries</p>
                <div className="flex items-center space-x-2 mr-2">
                  <SheetTrigger asChild>
                    <Button variant="outline" tooltipText="History">
                      <CounterClockwiseClockIcon className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </div>
              </div>
              <Separator />
              <div className="p-2 h-64 overflow-auto space-y-2">
                {Object.values<string>(QUERIES).map((savedQuery) => (
                  <Card
                    key={savedQuery}
                    className="hover:border-indigo-200 cursor-pointer"
                    onClick={() => {
                      runQuery(savedQuery);
                    }}
                  >
                    <CardContent className="p-1">
                      <SyntaxHighlighter className="text-sm" language="sql" wrapLongLines style={a11yLight}>
                        {savedQuery}
                      </SyntaxHighlighter>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardContent className="p-0">
            <div className="flex w-full justify-between items-center">
              <p className="font-bold text-center text-sm py-4 w-28 bg-gray-100 rounded-tl-xl">Output</p>
              <div className="flex items-center space-x-2 mr-2">
                {!!queryData.length && (
                  <CSVLink data={queryData} filename="data.csv">
                    <Button variant="outline" tooltipText="Download">
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </CSVLink>
                )}
              </div>
            </div>
            <Separator />
            <Table wrapperClassName="h-96" wrapperRef={tableContainerRef}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 sticky top-0 drop-shadow-md hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="p-4 text-bold">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-4 truncate max-w-[3rem]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      <SheetContent className="p-3">
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <Separator />
        </SheetHeader>
        <div className="mt-3 max-h-[90vh] space-y-2 overflow-auto">
          {queryHistory.map((history) => (
            <SheetClose asChild key={history.query}>
              <Card
                className="hover:border-indigo-200 cursor-pointer"
                onClick={() => {
                  runQuery(history.query);
                }}
              >
                <CardContent className="p-2 pb-0">
                  <SyntaxHighlighter language="sql" style={a11yLight} wrapLongLines>
                    {history.query}
                  </SyntaxHighlighter>
                </CardContent>
                <CardFooter className="p-2 justify-end">
                  <p className="text-gray-400 text-xs">Executed {dayjs(history.dateTime).fromNow()}</p>
                </CardFooter>
              </Card>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </div>
  );
}

export default HomePage;
