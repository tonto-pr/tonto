import { PlainFineModel, PlainGroupModel, PlainUserModel } from '../src/models';
import * as types from '../generated/common.types.generated';

const make = async (type: string, props: object = {}) => {
  switch(type) {
    case 'user':
      const temp_user = await PlainUserModel.create({
        email: 'testo@tmc.fi',
        username: 'testo',
        password: 'abcd',
        ...props
      } as types.ShapeOfPlainUser);
      return {...temp_user.toObject(), _id: temp_user.id}  as types.ShapeOfUser;
    case 'fine':
      const temp_fine = await PlainFineModel.create({
        receiverName: 'testo',
        amount: 1000,
        description: 'sakko.appin kehitys',
        ...props
      } as types.ShapeOfPlainFine)
      return {...temp_fine.toObject(), _id: temp_fine.id} as types.ShapeOfFine;
    case 'group':
      const temp_group = await PlainGroupModel.create({
        members: [],
        groupName: 'MJTJP',
        ...props
      } as types.ShapeOfPlainGroup)
      return {...temp_group.toObject(), _id: temp_group.id}  as types.ShapeOfGroup;
    default:
      return {_id: "123"}
  }
}

export default make;