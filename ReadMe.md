# CLL Catalogue subject grid with Isotope.js filters

See https://mycll.strath.ac.uk/.
Also the staging/development instance https://stage.mycll.strath.ac.uk/. *Last checked 2022-03-07*

## Approach

Front page of the Catalogue is a grid of subjects. 

Loaded via a Razor Host Module which allows 
* embedding .NET code, CSS, JS in the page
* querying the DNN database
* querying the current user's roles
* calling additional Razor script pages

## Narrative
### _CatalogueLanding.cshtml
**_CatalogueLanding.cshtml** is loaded on the page via the Razor Host module. It applies:
*	A single query that selects from a flatlist that's generated from a view with one row per subject. The View has the following columns
    * (subject) id, name, 
    * color and icon for display of the link container
    * All other columns in view are to be put in the class attribute of the container for filtering with isotope (js library)
        * classnames, classcodes, days, timeofdays, programmenames, modeofdelivery, campaignprogrammes, creditbearing
    * `CLL_TopLevelCategories_Grouped_FlatList sample data.xlsx` shows the raw data returned
* An inline JavaScript script block 
    * processes the URL parameters 
    * initstantiates the isotope grid filter
    * applies filters. The refiners/filters are select inputs with data-value/value of the class I want to filter by
* `@RenderPage("_CatalogueSearchContainer.cshtml")` embedding the second Razor script page
* `@foreach(var row in db.Query(selectTopLevelCategoriesSQL)){` renders each result of the query (i.e. subject) into the `div` managed by isotope
    * each subject record is a separate div using a boostrap (4) grid
    * each of the subject divs has class attribute of the columns from the view: classnames, classcodes, days, timeofdays, programmenames, modeofdelivery, campaignprogrammes, creditbearing

### _CatalogueSearchContainer.cshtml
This script is loaded by _CatalogueLanding.cshtml.

Its main functions are
* Load the relevant CSS and JS files. *They are loaded inline in this example but could be registered via `ClientResourceManager.RegisterScript`*
* Queries the database for the list of values to populate the "Programme" filter dropdown
    * `EWDS_CLL_Catalogue_Campaigns sample data.xlsx` shows the raw data returned
* Render the filter select boxes
    * most are hardcoded options except "Programme". The values are the data-value/class name that is used by the isotope filter
    * includes the tooltip icons and messages


### Isotope filtering
Filtering is performed by the inline script block in _CatalogueLanding.cshtml using isotope.js (loaded by _CatalogueSearchContainer.cshtml)

The contents of the category list grid are filtered based on whether an HTML element has a certain class or not
* Call .isotope() on list of subjects passing in itemSelector (the container div for subjects) and filter
* Filter determines whether the item should be returned or not, passing in a function of filterValues (the value of each select box concatenated together)
* When a filter is changed it updates the filterValues

[Istope.js on GitHub](https://github.com/metafizzy/isotope), note  the project has not been updated for 2 years and the last release was 2018

