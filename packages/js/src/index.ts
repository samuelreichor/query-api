import { getPreviewParams } from './utils/helper.js';
export { getPreviewParams };
export type ElementType = 'addresses' | 'assets' | 'entries' | 'users';
export type ExecutionMethod = 'all' | 'one';
export type Operator = 'and' | 'not' | 'or' | null;
export type EntryStatusString = 'live' | 'pending' | 'expired' | 'disabled' | null;
export type EntryStatus = EntryStatusString | (EntryStatusString | Operator)[];
export type UserStatusString =
  | 'active'
  | 'pending'
  | 'credentialed'
  | 'suspended'
  | 'locked'
  | 'inactive';
export type UserStatus = UserStatusString | (UserStatusString | Operator)[];

// Common query parameters shared by all element types, including allowed default methods
export interface CommonQueryParams {
  elementType: ElementType;
  one?: '1';
  all?: '1';
  id?: number | (number | Operator)[];
  limit?: number;
  offset?: number;
  orderBy?: string;
  fields?: string | string[];
  search?: string;
}

// Specific query parameters for each element type
export interface AddressQueryParams {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  locality?: string;
  organization?: string;
  fullName?: string;
}

export interface AssetQueryParams {
  volume?: string;
  kind?: string;
  filename?: string;
  site?: string;
  siteId?: number | (number | Operator)[];
}

export interface EntryQueryParams {
  slug?: string;
  uri?: string | string[];
  section?: string | string[];
  postDate?: string;
  site?: string;
  siteId?: number | (number | Operator)[];
  status?: EntryStatus;
  level?: number | (number | Operator)[];
  sectionId?: number | (number | Operator)[];
  type?: string | string[];
}

export interface UserQueryParams {
  group?: string | string[];
  groupId?: number | (number | Operator)[];
  email?: string;
  fullName?: string;
  hasPhoto?: boolean;
  status?: UserStatus;
  admin: 1;
}

// Merge Queryparams for better dx
export type MergedQueryParams<T extends ElementType> = CommonQueryParams &
  (T extends 'addresses'
    ? AddressQueryParams
    : T extends 'assets'
      ? AssetQueryParams
      : T extends 'entries'
        ? EntryQueryParams
        : T extends 'users'
          ? UserQueryParams
          : object);

// Common query methods shared by all element types, including allowed default methods
export interface CommonQueryBuilder {
  id: (value: CommonQueryParams['id']) => this;
  limit: (value: CommonQueryParams['limit']) => this;
  offset: (value: CommonQueryParams['offset']) => this;
  orderBy: (value: CommonQueryParams['orderBy']) => this;
  fields: (value: CommonQueryParams['fields']) => this;
  search: (value: CommonQueryParams['search']) => this;
  buildBaseUrl: (value: ExecutionMethod) => string;
}

// Element-specific query builder methods
export interface AddressQueryBuilder extends CommonQueryBuilder {
  addressLine1: (value: AddressQueryParams['addressLine1']) => this;
  addressLine2: (value: AddressQueryParams['addressLine2']) => this;
  addressLine3: (value: AddressQueryParams['addressLine3']) => this;
  locality: (value: AddressQueryParams['locality']) => this;
  organization: (value: AddressQueryParams['organization']) => this;
  fullName: (value: AddressQueryParams['fullName']) => this;
}

export interface AssetQueryBuilder extends CommonQueryBuilder {
  volume: (value: AssetQueryParams['volume']) => this;
  kind: (value: AssetQueryParams['kind']) => this;
  filename: (value: AssetQueryParams['filename']) => this;
  site: (value: AssetQueryParams['site']) => this;
  siteId: (value: AssetQueryParams['siteId']) => this;
}

export interface EntryQueryBuilder extends CommonQueryBuilder {
  slug: (value: EntryQueryParams['slug']) => this;
  uri: (value: EntryQueryParams['uri']) => this;
  section: (value: EntryQueryParams['section']) => this;
  postDate: (value: EntryQueryParams['postDate']) => this;
  site: (value: EntryQueryParams['site']) => this;
  siteId: (value: EntryQueryParams['siteId']) => this;
  status: (value: EntryQueryParams['status']) => this;
  level: (value: EntryQueryParams['level']) => this;
  sectionId: (value: EntryQueryParams['sectionId']) => this;
  type: (value: EntryQueryParams['type']) => this;
}

export interface UserQueryBuilder extends CommonQueryBuilder {
  group: (value: UserQueryParams['group']) => this;
  groupId: (value: UserQueryParams['groupId']) => this;
  email: (value: UserQueryParams['email']) => this;
  fullName: (value: UserQueryParams['fullName']) => this;
  hasPhoto: (value: UserQueryParams['hasPhoto']) => this;
  status: (value: UserQueryParams['status']) => this;
  admin: () => this;
}

// Mapping from ElementType to its specific QueryBuilder
export interface QueryBuilderMap {
  addresses: AddressQueryBuilder;
  assets: AssetQueryBuilder;
  entries: EntryQueryBuilder;
  users: UserQueryBuilder;
}

export type QueryBuilder<T extends ElementType> = QueryBuilderMap[T];

type Options = {
  autoPreview?: boolean;
  endpointUrl?: string;
};

const defaultOptions: Options = {
  autoPreview: true,
  endpointUrl: '/v1/api/queryApi/customQuery',
};

// Generic implementation of the function
export function buildCraftQueryUrl<T extends ElementType>(
  elementType: T,
  options: Options = defaultOptions,
): QueryBuilder<T> {
  const defaultParams: MergedQueryParams<T> = {
    elementType: 'entries',
  } as MergedQueryParams<T>;

  options = { ...defaultOptions, ...options };
  const params: MergedQueryParams<T> = defaultParams;
  params.elementType = elementType;

  // Common methods shared by all element types, including allowed default methods
  const commonBuilder: CommonQueryBuilder = {
    id(value) {
      params.id = value;
      return this;
    },
    limit(value) {
      params.limit = value;
      return this;
    },
    offset(value) {
      params.offset = value;
      return this;
    },
    orderBy(value) {
      params.orderBy = value;
      return this;
    },
    fields(value) {
      params.fields = value;
      return this;
    },
    search(value) {
      params.search = value;
      return this;
    },
    buildBaseUrl(value) {
      if (value === 'all') {
        params.one = undefined;
        params.all = '1';
      } else {
        params.one = '1';
        params.all = undefined;
      }

      /* TODO: add more error handling */
      const queryParams = Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value != '')
          .map(([key, value]) => [key, String(value)]),
      );

      const queryString = new URLSearchParams(queryParams).toString();
      let url = `${options.endpointUrl}?${queryString}`;

      if (options.autoPreview) {
        const previewTokens = getPreviewParams();
        if (previewTokens) {
          url += `&${previewTokens}`;
        }
      }
      return url;
    },
  };

  // Element-specific methods based on elementType
  if (elementType === 'addresses') {
    const addressParams = params as CommonQueryParams & AddressQueryParams;
    return {
      ...commonBuilder,
      addressLine1(value) {
        addressParams.addressLine1 = value;
        return this;
      },
      addressLine2(value) {
        addressParams.addressLine2 = value;
        return this;
      },
      addressLine3(value) {
        addressParams.addressLine3 = value;
        return this;
      },
      locality(value) {
        addressParams.locality = value;
        return this;
      },
      organization(value) {
        addressParams.organization = value;
        return this;
      },
      fullName(value) {
        addressParams.fullName = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'assets') {
    const assetParams = params as CommonQueryParams & AssetQueryParams;
    return {
      ...commonBuilder,
      volume(value) {
        assetParams.volume = value;
        return this;
      },
      kind(value) {
        assetParams.kind = value;
        return this;
      },
      filename(value) {
        assetParams.filename = value;
        return this;
      },
      site(value) {
        assetParams.site = value;
        return this;
      },
      siteId(value) {
        assetParams.siteId = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'entries') {
    const entryParams = params as CommonQueryParams & EntryQueryParams;
    return {
      ...commonBuilder,
      slug(value) {
        entryParams.slug = value;
        return this;
      },
      uri(value) {
        entryParams.uri = Array.isArray(value)
          ? value.filter((value) => value !== '').join('/')
          : value;
        return this;
      },
      section(value) {
        entryParams.section = value;
        return this;
      },
      postDate(value) {
        entryParams.postDate = value;
        return this;
      },
      site(value) {
        entryParams.site = value;
        return this;
      },
      siteId(value) {
        entryParams.siteId = value;
        return this;
      },
      status(value: EntryStatus) {
        entryParams.status = value;
        return this;
      },
      level(value) {
        entryParams.level = value;
        return this;
      },
      sectionId(value) {
        entryParams.sectionId = value;
        return this;
      },
      type(value) {
        entryParams.type = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'users') {
    // Cast params to include address-specific parameters
    const userParams = params as CommonQueryParams & UserQueryParams;
    return {
      ...commonBuilder,
      admin() {
        userParams.admin = 1;
        return this;
      },
      group(value) {
        userParams.group = value;
        return this;
      },
      groupId(value) {
        userParams.groupId = value;
        return this;
      },
      email(value) {
        userParams.email = value;
        return this;
      },
      fullName(value) {
        userParams.fullName = value;
        return this;
      },
      hasPhoto(value) {
        userParams.hasPhoto = value;
        return this;
      },
      status(value: UserStatus) {
        userParams.status = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  throw new Error(`Unsupported element type: ${elementType}`);
}
