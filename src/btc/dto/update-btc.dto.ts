import { PartialType } from '@nestjs/mapped-types';
import { CreateBtcDto } from './create-btc.dto';

export class UpdateBtcDto extends PartialType(CreateBtcDto) {}
