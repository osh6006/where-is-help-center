export const CenterRops = {
  method: "GET",
  redirect: "follow",
};

const AddressHeaders = new Headers();
AddressHeaders.append("X-NCP-APIGW-API-KEY-ID", "200onucn9f");
AddressHeaders.append(
  "X-NCP-APIGW-API-KEY",
  "uvVSkJaDZjW1PczEOyusUx91cpD6iyiy5ppLx9pD"
);

export const AddressRops = {
  method: "GET",
  headers: AddressHeaders,
  redirect: "follow",
};
