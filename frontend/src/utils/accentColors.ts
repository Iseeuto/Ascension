type Accent = { from: string; to: string };

type AccentColorsMap = {
  [kind: string]: {
    [slug: string]: Accent;
  };
};

const AccentColors: AccentColorsMap = {
  classes: { 
    bard: { from: "#4a2b69", to: "#b892de" },
    warrior: { from: "#823023", to: "#ed5139" },
    mage: { from: "#1b317d", to: "#3054d9" },
    sorcerer: { from: "#1aa393", to: "#36e3cf" },
    rogue: { from: "#661313", to: "#d93434" },
    ranger: { from: "#11822f", to: "#52cc72" },
    pugilist: { from: "#855615", to: "#de9d43" },
    priest: { from: "#8c8427", to: "#e3d432" } 
},
  races: {  },
};

export default AccentColors;