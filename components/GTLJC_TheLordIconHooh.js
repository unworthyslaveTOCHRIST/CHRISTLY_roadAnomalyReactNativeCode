// ALL THANKS AND GLORY TO THE AMD my ONLY GOD AND LORD JESUS CHRIST ALONE
import React from "react"
import { useImage } from "expo-image"

 const GTLJC_TheLordIconHook = function (GTLJC_anomaly){
      [GTLJC_icon, GTLJC_setIcon] = React.useState("")
      const GTLJC_iconImage = useImage(require("../assets/images/smooth_FORCHRIST.jpg"))
      GTLJC_setIcon(GTLJC_iconImage)
      return [GTLJC_icon, GTLJC_setIcon]
  }

  export default GTLJC_TheLordIconHook