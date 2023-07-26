/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function getThreadAffinity(): Array<number>
/** The different HTTP methods */
export const enum Methods {
  GET = 0,
  POST = 1,
  PUT = 2,
  PATCH = 3,
  DELETE = 4
}
/**
 * Use this to register a new route in the server, the callback function will be called
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function newRoute(route: string, method: Methods, callback: (result: RequestBlob) => void): void
/** Use this to clean all route in the server */
export function cleanupRouter(): void
/**
 * Adds a handler for the a GET request
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function get(route: string, callback: (result: RequestBlob) => void): void
/**
 * Adds a handler for the a POST request
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function post(route: string, callback: (result: RequestBlob) => void): void
/**
 * Adds a handler for the a PUT request
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function put(route: string, callback: (result: RequestBlob) => void): void
/**
 * Adds a handler for the a PATCH request
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function patch(route: string, callback: (result: RequestBlob) => void): void
/**
 * Adds a handler for the a delete request
 * once the endpoint has been hit. The callback includes a RequestBlob which has all the methods
 * needed to get the information from the request
 */
export function del(route: string, callback: (result: RequestBlob) => void): void
/**
 * This is called to start the server the address will need to include the IP and port
 * e.g. localhost:8080
 */
export function start(address: string): void
/**
 * This is called to start the server the address will need to include the IP and port
 * This allows you to configure the number of workers
 */
export function startWithWorkerCount(address: string, workers: number): void
/**
 * This is called to start the server the address will need to include the IP and port
 * This allows you to configure more of the parameters of the server current options are all options need to be strings:
 *
 * url: The url to listen on
 *
 * worker_threads: The number of worker threads to use
 *
 * backlog: The number of connections to queue up
 *
 * pool_per_worker_size: The size of the pool per worker
 *
 * debug: Whether to enable debug mode
 */
export function startWithConfig(config: {[key: string]: string}): void
/**
 * Attempts to stop the server, returns if it woreked
 * Experimental at the moment
 */
export function stop(): boolean
export function loadNewTemplate(groupName: string, directory: string): void
export function reloadGroup(groupName: string): void
export class RequestBlob {
  /** Add a new header to the response sent to the user */
  addHeader(key: string, value: string): void
  /**
   * Set the returning status code for this response to the user
   * Returns a boolean to indicate if the status code was set
   */
  setStatusCode(status: number): boolean
  /**
   * Get the query parameters as an object with each key and value
   * this will only be null if an error has occurred
   */
  getQueryParams(): {[key: string]: string}
  /**
   * Get the url parameters as an object with each key and value
   * this will only be null if an error has occurred
   */
  getUrlParams(): {[key: string]: string}
  /**
   * Get the url parameters as an object with each key and value
   * this will only be null if an error has occurred
   */
  headerLength(): number
  /**
   * Get the url parameters as an object with each key and value
   * this will only be null if an error has occurred
   */
  getHeader(name: string): string | null
  /**
   * Get the url parameters as an object with each key and value
   * this will only be null if an error has occurred
   */
  getAllHeaders(): {[key: string]: string}
  /** Retrieve the raw body bytes in a Uint8Array to be used */
  getBody(): {[key: string]: any}
  /** Retrieve the raw body bytes in a Uint8Array to be used */
  getBodyRaw(): string
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This sent a raw text string to the client
   */
  sendText(response: String): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This sent a raw text string to the client
   * This method will not check if a previous response has been sent doing so will result in undefined behavior but will be faster
   */
  sendTextUnchecked(response: String): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This sent a raw text string to the client but from a Javascript buffer, this can be faster
   */
  sendBytesText(response: Buffer): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This sent a raw text string to the client but from a Javascript buffer, this can be faster
   * This method will not check if a previous response has been sent doing so will result in undefined behavior but will be faster
   */
  uncheckedSendBytesText(response: Buffer): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send an empty string to the user, useful for testing
   */
  sendEmptyText(): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send an empty string to the user, useful for testing
   * This method will not check if a previous response has been sent doing so will result in undefined behavior but will be faster
   */
  uncheckedSendEmptyText(): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send a JSON object to client, it will be serialized rust side so no need to stringify
   */
  sendObject(response: any): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send a JSON object to client, it will be serialized rust side so no need to stringify
   * This needs to be a key value object, any other is undefined behaviour
   */
  sendFastObject(response: Object): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send a JSON object to client, it will be serialized rust side so no need to stringify
   * This needs to be a key value object, any other is undefined behaviour
   * This method will not check if a previous response has been sent doing so will result in undefined behavior but will be faster
   * The return value will only indicate if the message was sent or not
   */
  sendFastObjectUnchecked(response: Object): boolean
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will send a JSON object to client, however this is for objects that are already serialized to a string
   */
  sendStringifiedObject(response: String): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This will render a template and send it to the client
   * The function takes in the group name which needs to be registerd earlier, the file name and the context object which includes the data to be rendered
   */
  sendTemplateResp(group: String, file: String, context: String): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This can be used to notify of a server error
   */
  sendInternalServerError(): void
  /**
   * This needs to be called at the end of every request even if nothing is returned
   * This can be used to notify of a server error with a message to display
   */
  sendInternalServerErrorWithMessage(message: string): void
}
