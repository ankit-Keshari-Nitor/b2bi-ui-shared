import { ConfigurationContext, ConfigurationProvider, useConfiguration } from './ConfigurationProvider';
import { AuthProvider, AuthContext, useAuth } from './AuthProvider';
import { DataServiceContext, DataServiceProvider, useDataService } from './DataServiceProvider';
import { EnvironmentContext, EnvironmentProvider, useEnvironment } from './EnvironmentProvider';
import { ModalContext, ModalProvider, useModal } from './ModalProvider';
import { PageProvider, usePage as usePageContext } from './PageProvider';
import { ResourceContext, ResourceProvider, useResource } from './ResourceProvider';
import { RouterProvider } from './RouterProvider';

const ShellProviders = {
  AuthProvider,
  AuthContext,
  useAuth,

  ConfigurationContext,
  ConfigurationProvider,
  useConfiguration,

  DataServiceContext,
  DataServiceProvider,
  useDataService,

  EnvironmentContext,
  EnvironmentProvider,
  useEnvironment,

  ModalContext,
  ModalProvider,
  useModal,

  PageProvider,
  usePageContext,

  ResourceContext,
  ResourceProvider,
  useResource,

  RouterProvider
};

export default ShellProviders;

export {
  AuthProvider,
  AuthContext,
  useAuth,
  ConfigurationContext,
  ConfigurationProvider,
  useConfiguration,
  DataServiceContext,
  DataServiceProvider,
  useDataService,
  EnvironmentContext,
  EnvironmentProvider,
  useEnvironment,
  ModalContext,
  ModalProvider,
  useModal,
  PageProvider,
  usePageContext,
  ResourceContext,
  ResourceProvider,
  useResource,
  RouterProvider
};
