/*
####################################################################################################################################
                                                    CensorNSFW v1.0
####################################################################################################################################

A user-script for the English Wikipedia to hide NSFW images based on
a list of regex patterns, with a button to reveal those images individually.
The NSFW patterns are matched against the images' names and captions.

____________________________________________________________________________________________________________________________________
NOTE
The final bundled output is compiled with webpack (as it is written in TypeScript)
and is not easily readble to (most) humans.

The readable source code before compilation is hosted on GitHub:
===============================================================
https://<link to repo yet to be added>
===============================================================
____________________________________________________________________________________________________________________________________
*/

/* global mw, $, CensorNSFW_configs */

const _CONFIGS = {
  enable_debugging: false,
  // takes into account an image's
  // caption/description while matching the patterns
  detect_caption: true,
  // @ts-ignore-line
  ...(CensorNSFW_configs || {}),
};

let CensorNSFW_Button: HTMLLIElement;

const HELPER_FUNCTS = {
  is_enabled: () => {
    return mw.cookie.get("disableCensorNSFW") == "1" ? false : true;
  },
  disable_script: () => {
    mw.notify("CensorNSFW has been disabled.");
    mw.cookie.set("disableCensorNSFW", "1", {
      sameSite: "Strict",
    });

    // remove ALL nsfw_image class
    $(".nsfw_image").removeClass("nsfw_image");
    // remove ALL blur/overlay
    $(".nsfw_blurred").remove();
  },

  enable_script: () => {
    mw.notify("CensorNSFW has been enabled.");
    mw.cookie.set("disableCensorNSFW", "0", {
      sameSite: "Strict",
    });
    NSFW_SCRIPT_MAIN();
  },

  update_toolbox_button: () => {
    if (CensorNSFW_Button) $(CensorNSFW_Button).remove();
    if (HELPER_FUNCTS.is_enabled()) {
      CensorNSFW_Button = mw.util.addPortletLink(
        "p-cactions",
        "#",
        "Disable CensorNSFW",
        "ds-cnsfw",
        "Disable censoring NSFW images",
        "N"
      );
    } else {
      CensorNSFW_Button = mw.util.addPortletLink(
        "p-cactions",
        "#",
        "Enable CensorNSFW",
        "ds-cnsfw",
        "Enable censoring NSFW images",
        "N"
      );
    }

    $(CensorNSFW_Button)
      .off()
      .on("click", function (e) {
        e.preventDefault();
        if (HELPER_FUNCTS.is_enabled()) {
          HELPER_FUNCTS.disable_script();
        } else {
          HELPER_FUNCTS.enable_script();
        }
        HELPER_FUNCTS.update_toolbox_button();
      });
  },

  inject_CSS: (css: string) => {
    const elem = document.createElement("style");
    elem.innerText = css;
    document.head.appendChild(elem);
  },

  // extract file name from url src
  // eg, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rapinoe_candlestick.jpg/220px-Rapinoe_candlestick.jpg
  // to: Rapinoe candlestick.jpg
  extract_names: (elem: HTMLImageElement) => {
    const clean_text = (elem: JQuery<HTMLElement>) => elem.text().trim();
    const url = elem.src;

    const [second_last, last] = url.split("/").slice(-2);

    const relevant_name = second_last.length < 3 ? last : second_last;
    // decode special characters. replace `_` with ` ` (space).
    let file_name = decodeURIComponent(relevant_name).replace(/_/g, " ");

    if (_CONFIGS.detect_caption) {
      const caption_elem = $(elem)
        .parent()
        .parent()
        .children("[class$=caption]");

      if (caption_elem.length) {
        file_name += ` ${clean_text(caption_elem)}`;
      } else {
        const gallery_elem = $(elem).parents().closest("li.gallerybox");
        if (gallery_elem.length) {
          file_name += ` ${clean_text(gallery_elem)}`;
        } else {
          const infobox_elem = $(elem)
            .parents()
            .closest("td.infobox-image")
            .children(".infobox-caption");

          if (infobox_elem.length) {
            file_name += ` ${clean_text(infobox_elem)}`;
          }
        }
      }
    }

    return file_name;
  },

  generate_random_id: () => {
    return "censornsfw" + Math.random().toString(36).slice(2, 7);
  },

  reveal_button_hook: () => {
    $(".reveal_button")
      // remove existing events
      .off()
      .on("click", function () {
        const nsfwid = $(this).attr("data-nsfwid");
        // remove nsfw_image class
        $("." + nsfwid).removeClass("nsfw_image");
        // remove blur/overlay
        $(".nsfw_blurred." + nsfwid).remove();
      });
  },
};

HELPER_FUNCTS.update_toolbox_button();

// main script
const NSFW_SCRIPT_MAIN = () => {
  if (!HELPER_FUNCTS.is_enabled()) {
    if (_CONFIGS.enable_debugging)
      console.error("CensorNSFW is set to disabled.");

    return;
  }

  // inject required CSS into the page
  HELPER_FUNCTS.inject_CSS(NSFW_CSS);

  const images_on_page = document.querySelectorAll("img");

  images_on_page.forEach((elem) => {
    // extract images' name (and captions, if enabled)
    const file_name = HELPER_FUNCTS.extract_names(elem);

    NSFW_PATTERNS.every((pattern) => {
      if (file_name.match(pattern)) {
        const random_id = HELPER_FUNCTS.generate_random_id();
        if (_CONFIGS.enable_debugging) {
          console.log(`Matched "${file_name}" with pattern: `, pattern);
        }

        const REVEAL_BUTTON = `<button class="reveal_button" data-nsfwid="${random_id}" alt="Reveal NSFW content">Reveal</button>`;
        const CONTAINER = `<div class="nsfw_blurred ${random_id}">Potential NSFW content ${REVEAL_BUTTON}</div>`;

        // add the following classes to the OG image
        $(elem).addClass("nsfw_image");
        $(elem).addClass(random_id);

        // add the overlay and button container at the top inside
        // the second parent of the OG image
        $(elem).parent().parent().prepend(CONTAINER);

        HELPER_FUNCTS.reveal_button_hook();

        // break pattern loop
        return false;
      }

      // continue pattern loop
      return true;
    });
  });
};

// the array below contains regex patterns to consider X as NSFW
const NSFW_PATTERNS = [
  /(private.{0,3}part|breasted)/i,
  /\b(having|have|perform|depict|oral)(ing|).{0,14}sex/i,
  /\b(sex|69|t-square).{0,3}position/i,

  /\bpenetration\b/i,

  /\b(mating|coitus|intercourse|rape|copulate|copulating)\b/,
  /(\bsexual|erotic|erotism)/i,
  /\b(clitoris|rectum)\b/i,
  /\bfingering\b/,
  /\b(cunnilingus|anilingus|whipping|facesitting|flagellation|fellatio|fellation|bdsm|dominatrix|bondage|anal|anally|pegging|ejaculation|sperm)(s|es|)\b/i,
  /\bdeep\W{0,4}throat(ing|)\b/i,
  /\btea\W{0,4}bag(ging|)\b/i,
  /\b(testicle|testicular|nipple|breast|testes|testis|scrotum|genitalia|genital|anus|penis|vagina|vaginal|vaginally|vulva|vulvae|labia|ovary|ovaries)(s|es|)\b/i,
  /\b(reproduction|reproductive)/i,
  /\W*bath(er|ers|)\b/i,
  /\b(kamasutra|kama sutra|pubic)\b/i,

  /(naked|nude|nudist|naturist|nudity)(s|es|)\b/i,
  /(showering|skinny dipping|skinny dip|swim|swimming|sauna)/i,
  /(urine|urinating|urination|urinate|urinary)/i,
];

// CSS stuff
const NSFW_CSS = `
.nsfw_image {
  display: none !important;
}

.nsfw_blurred {
  background: #e37575;
  width: 100%;
  max-height:300px;
  min-height: 100px;
  color: white;
  display: grid;
  font-weight: bold;
  align-items: center;
}

.reveal_button {
  margin: 5px;
  cursor: pointer;
}
`;

// run the script

NSFW_SCRIPT_MAIN();
