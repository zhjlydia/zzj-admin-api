import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';

@Injectable()
export class OssService {
  private client: any;
  private readonly prefix: string = 'blog';
  private baseUrl = '';
  constructor(private configService: ConfigService) {
    this.client = new OSS({
      accessKeyId: this.configService.get<string>('OSSACCESSKEY'),
      accessKeySecret: this.configService.get<string>('OSSACCESSSECRET'),
      bucket: this.configService.get<string>('OSSBUCKET'),
      endpoint: this.configService.get<string>('OSSENDPOINT')
    });
    this.baseUrl = this.configService.get<string>('OSSRESOURCEDOMAIN').replace(/\/*$/, '/');
  }

  /**
   * 上传文件至OSS并返回完整url
   *
   * @param filename 文件名
   * @param file 文件路径或二进制数据
   * @param options 选项
   * @param prefix 文件路径前缀
   */
  async put(
    filename: string,
    file: Buffer | string,
    prefix?: string,
    options?: OSS.PutObjectOptions
  ) {
    filename = (prefix ? prefix : this.prefix) + filename;
    const { res } = await this.client.put(filename, file, options);
    // 将文件设置为公共可读
    await this.client.putACL(filename, 'public-read');
    if (res.status === 200) {
      return this.getUri(filename);
    } else {
      return '';
    }
  }

  /**
   * 获取文件夹下图片列表
   *
   * @param prefix 文件路径前缀
   */
  async list(prefix?: string) {
    const res = await this.client.list(
      {
        prefix,
        'max-keys': 100
      },
      { timeout: 1000 }
    );
    return res;
  }

  /**
   * 获取文件夹下图片列表
   *
   * @param prefix 文件路径前缀
   */
  async delete(name: string) {
    const res = await this.client.delete(name, { timeout: 1000 });
    return res;
  }

  public getUri(url: string) {
    return this.baseUrl + url.replace(/^\/+/, '');
  }

}
