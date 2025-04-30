export class ConfirmModalOptions {
  title: string;
  titleParams: object | undefined;
  body: string;
  bodyParams: object | undefined;

  constructor(title: string, body: string, titleParams: object | undefined, bodyParams: object | undefined) {
    this.title = title;
    this.body = body;
    this.bodyParams = bodyParams;
    this.titleParams = titleParams;
  }
}
