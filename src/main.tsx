import renderer, { tsx, create } from "@dojo/framework/core/vdom";
import Grid from "@dojo/widgets/grid";
import dojo from "@dojo/themes/dojo";
import "@dojo/themes/dojo/index.css";

import icache from "@dojo/framework/core/middleware/icache";
import {
  FetcherOptions,
  FetcherResult,
  ColumnConfig
} from "@dojo/widgets/grid/interfaces";
import TextInput from "@dojo/widgets/text-input";

/**
 * Custom fetcher that builds the API url based on the page/pageSize and filters.
 * Provides remote pagination combined with filters.
 */
async function fetcher(
  page: number,
  size: number,
  options: FetcherOptions = {}
): Promise<FetcherResult<any>> {
  let url = `https://mixolydian-appendix.glitch.me/user?page=${page}&size=${size}`;
  const { filter, sort } = options;
  if (filter) {
    Object.keys(filter).forEach(key => {
      url = `${url}&${key}=${filter[key]}`;
    });
  }
  if (sort) {
    url = `${url}&sort=${sort.columnId}&direction=${sort.direction}`;
  }
  await new Promise(resolve => setTimeout(resolve, 4000));
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return {
    data: data.data,
    meta: {
      total: data.total
    }
  };
}

/**
 * Custom updater that builds the API url based on the update item.
 * Provides remote updates for grid data.
 */
async function updater(item: any) {
  const { id, ...data } = item;
  const url = `https://mixolydian-appendix.glitch.me/user/${id}`;
  await fetch(url, {
    body: JSON.stringify(data),
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const factory = create({ icache });

const columnConfig: ColumnConfig[] = [
  {
    id: "firstName",
    title: "First Name",
    filterable: true,
    sortable: true,
    editable: true,
    resizable: true
  },
  {
    id: "lastName",
    title: "Last Name",
    filterable: true,
    sortable: true,
    editable: true,
    resizable: true
  },
  {
    id: "phoneNumber",
    title: "Phone #",
    filterable: true,
    sortable: true,
    editable: true,
    resizable: true
  },
  {
    id: "country",
    title: "Country",
    filterable: true,
    sortable: true,
    editable: true,
    resizable: true
  }
];

interface Item {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
}

const Example = factory(function Example({ middleware: { icache } }) {
  const selectedItems = icache.getOrSet<Item[]>("selected", []);

  return (
    <div>
      <Grid
        theme={dojo}
        height={500}
        pagination={true}
        onRowSelect={items => {
          icache.set("selected", items);
        }}
        fetcher={fetcher}
        updater={updater}
        columnConfig={columnConfig}
      />
      <div styles={{ height: "500px", overflow: "auto" }}>
        <h1>Selected Items</h1>
        {selectedItems.map(items => {
          return (
            <div
              styles={{
                margin: "5px",
                padding: "10px",
                border: "1px solid grey"
              }}
            >
              <TextInput
                theme={dojo}
                label="First Name"
                readOnly={true}
                value={items.firstName}
              />
              <TextInput
                theme={dojo}
                label="Last Name"
                readOnly={true}
                value={items.lastName}
              />
              <TextInput
                theme={dojo}
                label="Phone"
                readOnly={true}
                value={items.phoneNumber}
              />
              <TextInput
                theme={dojo}
                label="Country"
                readOnly={true}
                value={items.country}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

const r = renderer(() => <Example />);
r.mount();
