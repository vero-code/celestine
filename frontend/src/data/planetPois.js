// Example POI structure for each planet
export const planetPois = {
  Sun: [
    {
      name: "Sunspots",
      lat: 20, lon: 40,
      description: "Regions on the Sun's surface with reduced temperature, associated with strong magnetic fields.",
      earthAnalogKeyword: "aurora borealis",
      aiPrompt: "Sunspots are areas of intense magnetic activity on the Sun. On Earth, similar magnetic phenomena cause mesmerizing auroras. Do you want to know where they can be seen?",
      searchTerms: ["aurora borealis", "northern lights", "southern lights", "geomagnetic activity"]
    },
    {
      name: "Solar Flares",
      lat: -25, lon: -70,
      description: "Powerful eruptions of energy and particles from the Sun's surface.",
      earthAnalogKeyword: "geomagnetic storm",
      aiPrompt: "Solar flares are explosive events on the Sun that can affect Earth, causing geomagnetic storms. Learn how these cosmic events impact our planet.",
      searchTerms: ["geomagnetic storm", "solar radiation impact on Earth"]
    },
  ],
  Mercury: [
    {
      name: "Caloris Basin",
      lat: 0, lon: 130,
      description: "A gigantic impact basin, one of the largest in the Solar System, formed by an ancient collision.",
      earthAnalogKeyword: "large impact crater",
      aiPrompt: "The Caloris Basin on Mercury is a giant impact crater, similar in scale and formation history to large impact structures on Earth, such as the Sudbury Crater in Canada. Do you want to find its geological analogs?",
      searchTerms: ["giant impact crater", "Sudbury Crater"]
    },
    {
      name: "Discovery Rupes",
      lat: -10, lon: -60,
      description: "A massive scarp formed by the compression of Mercury's crust as it cooled.",
      earthAnalogKeyword: "geological fault",
      aiPrompt: "This scarp is evidence of Mercury's crustal compression, similar to tectonic faults and scarps found in California, for example, along the San Andreas Fault. Do you want to learn more about such places?",
      searchTerms: ["tectonic fault", "San Andreas Fault"]
    },
  ],
  Venus: [
    {
      name: "Maxwell Montes",
      lat: 10, lon: -40,
      description: "The highest mountain range on Venus, possibly formed by tectonic processes.",
      earthAnalogKeyword: "high folded mountains",
      aiPrompt: "Maxwell Montes on Venus are likely the result of massive tectonic shifts, analogous to the formation of the Himalayas or Andes on Earth. We can find these majestic mountain ranges.",
      searchTerms: ["Himalayas", "Andes", "high mountains"]
    },
    {
      name: "Maat Mons",
      lat: 30, lon: 40,
      description: "A large shield volcano, one of the highest on Venus.",
      earthAnalogKeyword: "shield volcano",
      aiPrompt: "The shield volcano Maat Mons on Venus is similar in shape to massive shield volcanoes like Mauna Loa in Hawaii. Look at these impressive volcanoes on Earth.",
      searchTerms: ["Hawaii shield volcano", "Mauna Loa"]
    },
    {
      name: "Pancake Domes Fields",
      lat: -35, lon: 75,
      description: "Unique volcanic structures with flat tops and steep sides, formed by viscous lava.",
      earthAnalogKeyword: "lava domes",
      aiPrompt: "These strange 'pancake' domes on Venus resemble lava domes on Earth, formed by very viscous lava. Such formations are found, for example, in the Mojave Desert. Shall we explore them?",
      searchTerms: ["lava domes", "viscous lava"]
    },
  ],
  Mars: [
    {
      name: "Olympus Mons",
      lat: -20.4, lon: -50,
      description: "The largest volcano in the Solar System, a huge shield volcano.",
      earthAnalogKeyword: "largest shield volcano",
      aiPrompt: "Olympus Mons on Mars is a shield volcano similar to the Hawaiian volcanoes, but on a much larger scale. Imagine it next to Mauna Loa!",
      searchTerms: ["Hawaii shield volcano", "Mauna Loa"]
    },
    {
      name: "Valles Marineris",
      lat: 24, lon: 60,
      description: "A colossal canyon system, significantly larger than the Grand Canyon.",
      earthAnalogKeyword: "giant canyon",
      aiPrompt: "Valles Marineris on Mars is a canyon system that makes the Grand Canyon in Arizona seem small. Do you want to explore Earth analogs?",
      searchTerms: ["Grand Canyon Arizona", "largest canyon"]
    },
    {
      name: "Gale Crater",
      lat: -5.4, lon: 137.7,
      description: "An impact crater with a central mountain, explored by the Curiosity rover, with signs of ancient lakes.",
      earthAnalogKeyword: "ancient lake crater",
      aiPrompt: "Gale Crater on Mars was once a lake, similar to ancient lake deposits we find in Earth's deserts, such as Death Valley. Learn more about them.",
      searchTerms: ["ancient lake desert", "Death Valley"]
    },
    {
      name: "Polar Ice Caps (North/South)",
      lat: -65.4, lon: 0,
      description: "Ice caps composed of water ice and dry ice, expanding and contracting seasonally.",
      earthAnalogKeyword: "polar ice caps",
      aiPrompt: "Mars' polar caps, like Earth's polar regions, are composed of frozen water and other volatiles. Explore Earth's polar ice.",
      searchTerms: ["Arctic", "Antarctica", "polar ice caps"]
    },
    {
      name: "Kasei Valles",
      lat: 55, lon: -25,
      description: "A massive outflow channel system formed by gigantic floods.",
      earthAnalogKeyword: "giant riverbeds",
      aiPrompt: "Kasei Valles on Mars resembles huge ancient riverbeds left by catastrophic floods on Earth, for example, in the Rocky Mountains region. Do you want to see them?",
      searchTerms: ["ancient riverbeds", "flood river channels"]
    }
  ],
};