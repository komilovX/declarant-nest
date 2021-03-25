export const sidebarItems = [
  {
    name: 'Главная',
    icon: 'el-icon-s-home',
    link: '/',
    value: 'index',
  },
  {
    name: 'Заявки',
    icon: 'el-icon-files',
    link: '/orders',
    value: 'orders',
  },
  {
    name: 'Мои заявки',
    icon: 'el-icon-s-order',
    link: '/my-orders',
    value: 'my-orders',
  },
  {
    name: 'Мои задачи',
    icon: 'el-icon-document-checked',
    link: '/tasks',
    value: 'tasks',
  },
  {
    name: 'Контракты',
    icon: 'el-icon-s-management',
    link: '/contracts',
    value: 'contracts',
  },
  {
    name: 'Данные',
    icon: 'el-icon-folder-opened',
    group: true,
    expanded: false,
    value: 'data',
    childs: [
      {
        name: 'Клиенты',
        link: '/data/clients',
        value: 'data-clients',
      },
      {
        name: 'Документы',
        link: '/data/documents',
        value: 'data-documents',
      },
      {
        name: 'Отделы',
        link: '/data/departments',
        value: 'data-departments',
      },
      {
        name: 'Грузоотправители',
        link: '/data/shippers',
        value: 'data-shippers',
      },
      {
        name: 'Товары',
        link: '/data/products',
        value: 'data-products',
      },
    ],
  },
  {
    name: 'Архив',
    icon: 'el-icon-s-cooperation',
    link: '/archive',
    value: 'archive',
  },
  {
    name: 'Доступ',
    icon: 'el-icon-lock',
    group: true,
    expanded: false,
    value: 'access',
    childs: [
      {
        name: 'Пользователи',
        link: '/access/users',
        value: 'access-users',
      },
      {
        name: 'Роли',
        link: '/access/roles',
        value: 'access-roles',
      },
    ],
  },
]

export const sidebarRoles = [
  {
    name: 'Главная',
    value: 'index',
  },
  {
    name: 'Заявки',
    value: 'orders',
  },
  {
    name: 'Мои заявки',
    value: 'my-orders',
  },
  {
    name: 'Мои задачи',
    value: 'tasks',
  },
  {
    name: 'Контракты',
    value: 'contracts',
  },
  {
    name: 'Данные',
    value: 'data',
    childs: [
      {
        name: 'Клиенты',
        value: 'data-clients',
      },
      {
        name: 'Документы',
        value: 'data-documents',
      },
      {
        name: 'Отделы',
        value: 'data-departments',
      },
      {
        name: 'Грузоотправители',
        value: 'data-shippers',
      },
      {
        name: 'Товары',
        value: 'data-products',
      },
    ],
  },
  {
    name: 'Архив',
    value: 'archive',
  },
  {
    name: 'Доступ',
    value: 'access',
    childs: [
      {
        name: 'Пользователи',
        value: 'access-users',
      },
      {
        name: 'Роли',
        value: 'access-roles',
      },
    ],
  },
]
