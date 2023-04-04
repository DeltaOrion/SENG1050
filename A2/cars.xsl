<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html" />

    <xsl:template match="/">

		<html lang="en">
			<head>	
			 	<link rel="stylesheet" href="style.css" type="text/css" />
				 <!-- Ensure the title has the releevant category in it-->
				<title>Jim's - <xsl:value-of select="cars/@type"/><xsl:text> Car's</xsl:text></title>		
				<meta charset="UTF-8" />	

				<style>

				</style>	
				
			</head>
	    	<body>
	    		<header class = "header-fixed">
		            <div class = "header-navbar">
		                <!-- Logo image links back to the homepage-->
		                <a href="index.html"><img src="images/logo.png" class="brand" alt = "home" style="width: 100px; height:60px; left: 1cm;"></img></a>
		                <nav class = "nav-list">
		                    <ul>
		                        <!-- Sample list of links. Most of them do not work or even belong to the sitemap but they are there
		                             for the prototype simply to display to populate the navbar with placeholders for the prototype-->
		                        <li><a href="flying-cars.xml">Flying</a></li>
		                        <li><a href="sapient-cars.xml">Sapient</a></li>
		                        <li><a href="sale.html">Sale</a></li>
		                        <li><a href="about.html">About</a></li>
		                        <li><a href="contact.html">Contact</a></li>
		                        <li><a href="privacy.html">Privacy</a></li>
		                        <li><a href="conditions.html">Terms &#38; Conditions</a></li>
		                        <li></li>
		                    </ul>
		                </nav>
		            </div>
        		</header> 

        		<div class="buffer"></div>	

        		<main>
					<!-- Ensure the level 1 heading has the appropiate category -->
        			<div class="sect">
        				<h1><xsl:value-of select="cars/@type"/><xsl:text> Car's</xsl:text></h1>
        				<p>Need it sold? Jim's the one!</p>
        			</div>
					<!-- Loop through all of the cars -->
        			<xsl:for-each select="cars/car">
						<!-- Sort all cars by model -->
        				<xsl:sort select="type/model"/> 
						<!-- These will be used for the href and src respectively -->
        				<xsl:variable name="promotional-image" select="promotional/picture"/>
        				<xsl:variable name="manufacturer-web" select="promotional/manufacturer"/>
        				<h2><xsl:value-of select="type/make"/><xsl:text> </xsl:text><xsl:value-of select="type/model"/></h2>
        				<!-- Formatting trick to save myself making responsive grids -->

        				<div class = "display-cars">
        					<ul>
        						<li>
									<!-- Basic information about the cars,
									     shows the capacity, safety, description etc etc. 
										 This floats the image of the car to the left and displays all the relevant information to the right.  -->
	        						<img src = "{$promotional-image}" alt="promotional image showing the car" class = "display-cars-img"></img>
			        				<p> <xsl:value-of select="description"/><br/>
			        					<strong>Capacity: </strong><xsl:value-of select="capacity"/> <br/>
			        					<strong>Safety: </strong><xsl:value-of select="safety/rating/@stars"/> <xsl:text>/5 Stars</xsl:text><br/>
			        					<strong>Manufacturer </strong><a href="{$manufacturer-web}"><xsl:value-of select="$manufacturer-web"/></a><br/>
										<strong>Drive Away From </strong><xsl:text>$</xsl:text><xsl:value-of select="cost"></xsl:value-of></p>
		        				</li>
	        				</ul>
        				</div>
						<!-- 
							There are a lot of different options for the cars and each are quite different. Here
							we essentially use a switch statement to find out which extra is being used. and depending
							on the extra, format the page correctly for said extra. 
						-->
        				<h3>Optional Extras</h3>
						<!-- For each extra in the car -->
        				<xsl:for-each select="extras/extra">
        					<xsl:variable name="electric" select="option/electric"/>
        					<xsl:variable name="flight" select="option/flight"/>
        					<xsl:variable name="ai" select="option/ai"/>
        					<xsl:variable name="paint" select="option/paint"/>

        					<xsl:choose>
								<!-- If the electric is present -->
        						<xsl:when test="$electric!=''">
        							<h4>Electric</h4>
        							<p><strong>Battery's</strong><br/></p>
        							<ul>
        								<xsl:for-each select="option/electric/battery">
	        								<li><xsl:value-of select="."/></li>
	        							</xsl:for-each>
        							</ul>
        							<p><strong>Range </strong><xsl:value-of select="option/electric/range"/></p>
        						</xsl:when>

        						<xsl:when test="$flight!=''">
									<!-- If the flight extra is avaliable -->
        							<h4>Flight</h4>
        							<p><strong>Wing Span </strong><xsl:value-of select="option/flight/wing-span"/>
										<xsl:if test="option/flight/turbo-jet">
										  	<br />Turbo Jet Included!
										</xsl:if> 
        							</p>
        						</xsl:when>


        						<xsl:when test="$ai!=''">
									<!-- if the AI extra is avaliable -->
        							<h4>Artificial Intelligence</h4>
        							<p><strong>Type: </strong><xsl:value-of select="option/ai/@type"/><br/>
        								<strong>Brand: </strong><xsl:value-of select="option/ai" /></p>
        						</xsl:when>

        						<xsl:when test="$paint!=''">
									<!-- if the paint extra is avaliable -->
        							<h4>Paint</h4>
        							<p><strong>Color: </strong><xsl:value-of select="option/paint/color"/></p>
        						</xsl:when>
        					</xsl:choose>

        					<xsl:variable name="cost" select="cost"/>
							<!-- The extra can either have a cost or a mark, if it does not have a cost then it has a mark
								display the mark if the extra has a mark otherwise display thbe cost
							-->
        					<xsl:choose>
        						<xsl:when test="$cost!=''">
        							<p style="margin: 0px;"><strong>Cost</strong> $<xsl:value-of select="$cost"/></p>
        						</xsl:when>

        						<xsl:otherwise>
        							<p style="margin: 0px;"><strong>Mark: </strong><xsl:value-of select="mark"/></p>
        						</xsl:otherwise>
        					</xsl:choose>
        				</xsl:for-each>
						<!--If the car has reviews 
							For each review on the car
						      display the review stars and the comment -->
							
        				<xsl:if test="reviews">
        					<h3>Reviews</h3>
        					<xsl:for-each select="reviews/review">
        						<h4><xsl:value-of select="./@id"/></h4>
        						<p><strong>Rating </strong><xsl:value-of select="rating/@stars"/><xsl:text>/5</xsl:text><br/>
        							<xsl:value-of select="comment"/>
        						</p>
        					</xsl:for-each>
        				</xsl:if>
						<!-- If the car has coupons
							 For each coupon on the car
							 display the review coupons and the discount that is provided
						-->
        				<xsl:if test="coupons">
        					<h3>Coupons</h3>
        					<xsl:for-each select="coupons/coupon">
        						<p><strong>Code </strong><xsl:value-of select="code"/> <br/>
        							<strong>Discount </strong><xsl:value-of select="reduction"/></p>
        					</xsl:for-each>
        				</xsl:if>
        			</xsl:for-each>
        		</main>

        		<footer>
            		<div class="copyright">
                		<p>&#169; 2021-2021 Copyright Jacob Boyce; All rights reserved.</p>
                		<p>Jacob Boyce, University of Newcastle</p>
                		<p>&#128231; <a href="mailto:c3264527@uon.edu.au">c3264527@uon.edu.au</a></p>
            		</div>
            
        		</footer>

	    	</body>
		</html>


   	</xsl:template>
	
</xsl:stylesheet> 