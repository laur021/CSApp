import { CONTROLLER } from './controllers';
import { API_URL } from './apiurl';

export const API_ENDPOINTS = {
  /**
   *
   *  ACCOUNT
   *
   *  */
  ACCOUNT: {
    LOGIN: `${API_URL}/${CONTROLLER.ACCOUNTS}/login`,
    REFRESH: `${API_URL}/${CONTROLLER.ACCOUNTS}/me`,
    REGISTER: `${API_URL}/${CONTROLLER.ACCOUNTS}/register`,
    GET_ALL: `${API_URL}/${CONTROLLER.ACCOUNTS}`,
    GET_BY_ID: (id: number) => `${API_URL}/${CONTROLLER.ACCOUNTS}/${id}`,
    UPDATE_DETAILS: (id: number) =>
      `${API_URL}/${CONTROLLER.ACCOUNTS}/${id}/details`,
    UPDATE_PASSWORD: (id: number) =>
      `${API_URL}/${CONTROLLER.ACCOUNTS}/${id}/resetPassword`,
    DELETE: (id: number) => `${API_URL}/${CONTROLLER.ACCOUNTS}/${id}`,
  },

  /**
   *
   * ACTIVITY LOG
   *
   *  */
  ACTIVITY_LOG: `${API_URL}/${CONTROLLER.ACTIVITY_LOGS}`,

  /**
   *
   *  PRODUCT
   *
   * */
  PRODUCT: (id?: number) =>
    id
      ? `${API_URL}/${CONTROLLER.PRODUCTS}/${id}`
      : `${API_URL}/${CONTROLLER.PRODUCTS}`,

  /**
   *
   *  DESCRIPTION
   *
   * */
  DESCRIPTION: (id?: number) =>
    id
      ? `${API_URL}/${CONTROLLER.DESCRIPTIONS}/${id}`
      : `${API_URL}/${CONTROLLER.DESCRIPTIONS}`,

  /**
   *
   *  PRODUCT LOGS
   *
   * */
  PRODUCT_LOGS: (id?: number) =>
    id
      ? `${API_URL}/${CONTROLLER.PRODUCT_LOGS}/${id}`
      : `${API_URL}/${CONTROLLER.PRODUCT_LOGS}`,

  /**
   *
   *  DESCRIPTION LOGS
   *
   * */
  DESCRIPTION_LOGS: (id?: number) =>
    id
      ? `${API_URL}/${CONTROLLER.DESCRIPTION_LOGS}/${id}`
      : `${API_URL}/${CONTROLLER.DESCRIPTION_LOGS}`,

  /**
   *
   *  TRANSACTION
   *
   * */
  TRANSACTIONS: {
    ADD: `${API_URL}/${CONTROLLER.TRANSACTIONS}`,
    GET_PAGINATED_LIST: `${API_URL}/${CONTROLLER.TRANSACTIONS}/list`,
    GET_LIST: `${API_URL}/${CONTROLLER.TRANSACTIONS}/list/all`,
    GET_BY_ID: (transactionId: string) =>
      `${API_URL}/${CONTROLLER.TRANSACTIONS}/${transactionId}`,
    UPDATE: (transactionId: string) =>
      `${API_URL}/${CONTROLLER.TRANSACTIONS}/${transactionId}`,
    DELETE: (id: number) => `${API_URL}/${CONTROLLER.TRANSACTIONS}/${id}`,
  },

  /**
   *
   *  TRANSACTION LOGS
   *
   * */
  TRANSACTION_LOGS: (id?: string) =>
    id
      ? `${API_URL}/${CONTROLLER.TRANSACTION_LOGS}/${id}`
      : `${API_URL}/${CONTROLLER.TRANSACTION_LOGS}`,

  /**
   *
   *  STATISTICS
   *
   * */
  STATISTICS: {
    GET_USER: `${API_URL}/${CONTROLLER.STATISTICS}/User`,
    GET_PRODUCT: `${API_URL}/${CONTROLLER.STATISTICS}/Product`,
    GET_DESCRIPTION: `${API_URL}/${CONTROLLER.STATISTICS}/Description`,
    GET_TRANSACTION: `${API_URL}/${CONTROLLER.STATISTICS}/Transaction`,
  },

  /**
   *
   *  HELPERS
   *
   * */
  HELPERS: {
    GET: `${API_URL}/${CONTROLLER.HELPERS}/get-ip`,
  },
};
