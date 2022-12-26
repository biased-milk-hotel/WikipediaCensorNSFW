/* NOTE
  The final bundled output is compiled with webpack (as the source code is written in TypeScript)
  and is not easily readble to (most) humans.

  The readable source code before compilation is hosted on GitHub:
===============================================================
    https://github.com/biased-milk-hotel/WikipediaCensorNSFW
===============================================================
____________________________________________________________________________________________________________________________________
  */
(() => {
    "use strict";
    var e = {
        414: (e, n) => {
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            n.NSFW_PATTERNS = void 0;
            n.NSFW_PATTERNS = [ /(private.{0,3}part|breasted)/i, /\b(having|have|perform|depict|oral)(ing|).{0,14}sex/i, /\b(sex|69|t-square).{0,3}position/i, /\bpenetration\b/i, /\b(mating|coitus|intercourse|rape|copulate|copulating)\b/, /(\bsexual|erotic|erotism)/i, /\b(clitoris|rectum)\b/i, /\bfingering\b/, /\b(cunnilingus|anilingus|whipping|facesitting|flagellation|fellatio|fellation|bdsm|dominatrix|bondage|anal|anally|pegging|ejaculation|sperm)(s|es|)\b/i, /\bdeep\W{0,4}throat(ing|)\b/i, /\btea\W{0,4}bag(ging|)\b/i, /\b(testicle|testicular|nipple|breast|testes|testis|scrotum|genitalia|genital|anus|penis|vagina|vaginal|vaginally|vulva|vulvae|labia|ovary|ovaries)(s|es|)\b/i, /\b(reproduction|reproductive)/i, /\W*bath(er|ers|)\b/i, /\b(kamasutra|kama sutra|pubic)\b/i, /(naked|nude|nudist|naturist|nudity)(s|es|)\b/i, /(showering|skinny dipping|skinny dip|swim|swimming|sauna)/i, /(urine|urinating|urination|urinate|urinary)/i ];
        }
    };
    var n = {};
    function t(i) {
        var a = n[i];
        if (a !== undefined) {
            return a.exports;
        }
        var s = n[i] = {
            exports: {}
        };
        e[i](s, s.exports, t);
        return s.exports;
    }
    var i = {};
    (() => {
        var e = i;
        var n;
        /*
####################################################################################################################################
                                                    CensorNSFW v1.0
####################################################################################################################################

A user-script for the English Wikipedia to hide NSFW images based on
a list of regex patterns, with a button to reveal those images individually.
The NSFW patterns are matched against the images' names and captions.

*/        n = {
            value: true
        };
        const a = t(414);
        let s = {};
        if (typeof CensorNSFW_configs !== "undefined") {
            s = CensorNSFW_configs;
        }
        const o = {
            enable_debugging: false,
            detect_caption: true,
            ...s
        };
        let r;
        const l = {
            is_enabled: () => mw.cookie.get("disableCensorNSFW") == "1" ? false : true,
            disable_script: () => {
                mw.notify("CensorNSFW has been disabled.");
                mw.cookie.set("disableCensorNSFW", "1", {
                    sameSite: "Strict"
                });
                $(".nsfw_image").removeClass("nsfw_image");
                $(".nsfw_blurred").remove();
            },
            enable_script: () => {
                mw.notify("CensorNSFW has been enabled.");
                mw.cookie.set("disableCensorNSFW", "0", {
                    sameSite: "Strict"
                });
                c();
            },
            update_toolbox_button: () => {
                if (r) $(r).remove();
                if (l.is_enabled()) {
                    r = mw.util.addPortletLink("p-cactions", "#", "Disable CensorNSFW", "ds-cnsfw", "Disable censoring NSFW images", "N");
                } else {
                    r = mw.util.addPortletLink("p-cactions", "#", "Enable CensorNSFW", "ds-cnsfw", "Enable censoring NSFW images", "N");
                }
                $(r).off().on("click", (function(e) {
                    e.preventDefault();
                    if (l.is_enabled()) {
                        l.disable_script();
                    } else {
                        l.enable_script();
                    }
                    l.update_toolbox_button();
                }));
            },
            inject_CSS: e => {
                const n = document.createElement("style");
                n.innerText = e;
                document.head.appendChild(n);
            },
            extract_names: e => {
                const n = e => e.text().trim();
                const t = e.src;
                const [i, a] = t.split("/").slice(-2);
                const s = i.length < 3 ? a : i;
                let r = decodeURIComponent(s).replace(/_/g, " ");
                if (o.detect_caption) {
                    const t = $(e).parent().parent().children("[class$=caption]");
                    if (t.length) {
                        r += ` ${n(t)}`;
                    } else {
                        const t = $(e).parents().closest("li.gallerybox");
                        if (t.length) {
                            r += ` ${n(t)}`;
                        } else {
                            const t = $(e).parents().closest("td.infobox-image").children(".infobox-caption");
                            if (t.length) {
                                r += ` ${n(t)}`;
                            }
                        }
                    }
                }
                return r;
            },
            generate_random_id: () => "censornsfw" + Math.random().toString(36).slice(2, 7),
            reveal_button_hook: () => {
                $(".reveal_button").off().on("click", (function() {
                    const e = $(this).attr("data-nsfwid");
                    $("." + e).removeClass("nsfw_image");
                    $(".nsfw_blurred." + e).remove();
                }));
            }
        };
        l.update_toolbox_button();
        const c = () => {
            if (!l.is_enabled()) {
                if (o.enable_debugging) console.error("CensorNSFW is set to disabled.");
                return;
            }
            l.inject_CSS(d);
            const e = document.querySelectorAll("img");
            e.forEach((e => {
                const n = l.extract_names(e);
                a.NSFW_PATTERNS.every((t => {
                    if (n.match(t)) {
                        const i = l.generate_random_id();
                        if (o.enable_debugging) {
                            console.log(`Matched "${n}" with pattern: `, t);
                        }
                        const a = `<button class="reveal_button" data-nsfwid="${i}" alt="Reveal NSFW content">Reveal</button>`;
                        const s = `<div class="nsfw_blurred ${i}">Potential NSFW content ${a}</div>`;
                        $(e).addClass("nsfw_image");
                        $(e).addClass(i);
                        $(e).parent().parent().prepend(s);
                        l.reveal_button_hook();
                        return false;
                    }
                    return true;
                }));
            }));
        };
        const d = `\n.nsfw_image {\n  display: none !important;\n}\n\n.nsfw_blurred {\n  background: #e37575;\n  width: 100%;\n  max-height:300px;\n  min-height: 100px;\n  color: white;\n  display: grid;\n  font-weight: bold;\n  align-items: center;\n}\n\n.reveal_button {\n  margin: 5px;\n  cursor: pointer;\n}\n`;
        c();
    })();
})();