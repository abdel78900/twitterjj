import {atom} from 'recoil'

export const modalState = atom({
    key: "modalState",
    default:false,
});
export const modalTweetState = atom({
    key: "modalTweetState",
    default:false,
});
export const modalDeleteState = atom({
    key: "modalDeleteState",
    default:false,
});

export const postIdState = atom({
    key: "postIdState",
    default:"",
});