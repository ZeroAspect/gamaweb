async function getIpGeolocation(){
  const ip = await fetch("https://api.ipgeolocation.io/getip")
  const data = ip.json()

  return data
}

module.exports = getIpGeolocation