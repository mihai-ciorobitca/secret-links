const express = require("express");
const supabase = require("@supabase/supabase-js");
const session = require("express-session");
const path = require('path')

require('dotenv').config();

app = express();
app.set('views', path.join(__dirname, 'views')) 
app.set("view engine", "ejs");

const URL = process.env.URL;
const SECRET = process.env.SECRET;

supabase_client = supabase.createClient(URL, SECRET);

app.get("/", (_, res) => {
    return res.render("index");
});

app.get("/admin", (req, res) => {
    if (session.admin) {
        return res.render("admin");
    }
    return res.redirect("/login");
});

app.get("/:name", async (req, res) => {
    const { name } = req.params;
    const { data, error } = await supabase_client
        .from("links")
        .select("url")
        .eq("name", name);
    if (error) {
        return res.status(500).json({ error: "Database query failed." });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: "Link not registered." });
    }

    const { url } = data[0];
    return res.redirect(url);

});

app.listen(3000, () => {
    console.log("Running");
});